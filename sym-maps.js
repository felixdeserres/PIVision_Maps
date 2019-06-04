(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);
	
	var definition = { 
		typeName: "maps",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		iconUrl: 'Images/maps.svg',
		getDefaultConfig: function(){ 
			return { 
				DataShape:'Table',
				Height: 500,
				Width: 500 
			} 
		}
	}

	symbolVis.prototype.init = function(scope, elem) {	
			//Initial values
			var value=0;
			var NumberAtt=5;
			var attributeValue=[];
			var Initialized=false;	

			//Intialize the maps object
			var container=elem.find('#container')[0];
			container.id="maps_"+scope.symbol.Name;
			var map = am4core.create(container, am4maps.MapChart);
			map.geodata=am4geodata_canadaHigh;
			map.projection=new am4maps.projections.Miller();
			var polygonSeries=new am4maps.MapPolygonSeries();
			polygonSeries.useGeodata=true;
			map.series.push(polygonSeries);
			var imageSeries=map.series.push(new am4maps.MapImageSeries());
			var imageSeriesTemplate=imageSeries.mapImages.template;
			
			//Assign properties
			imageSeriesTemplate.propertyFields.latitude="latitude";
			imageSeriesTemplate.propertyFields.longitude="longitude";
			imageSeriesTemplate.tooltipText="{cityname} \n Hockey Team:{hockeyteam} \n Population:{population}";

			//Define map images
			var image=imageSeriesTemplate.createChild(am4core.Image);
			image.propertyFields.href="imageURL";
			image.width=10;
			image.height=10;
			image.horizontalCenter="right";
			image.verticalCenter="bottom";
			
			//Convert PI AF data to maps data (only works for this type of elements...)
			function convertData(data){
				var NumberElement=data.Rows.length/NumberAtt;
				var y=0;
				
				if (Initialized==false)
				{
					for (var i=0;i<NumberElement;i++)
					{
						attributeValue.push({cityname:"",hockeyteam:"",latitude:0,longitude:0,population:0});
						if (i==(NumberElement-1))
						{
							Initialized=true;
						}
					}
				}

				if (!data) return;
				
				for (var i=0;i<NumberElement;i++)
				{	
					attributeValue[i].cityname=data.Rows[i*5].Value;
					attributeValue[i].hockeyteam=data.Rows[i*5+1].Value;
					attributeValue[i].latitude=parseFloat(data.Rows[i*5+2].Value);
					attributeValue[i].longitude=parseFloat(data.Rows[i*5+3].Value);
					attributeValue[i].population=data.Rows[i*5+4].Value;
					//map objects icon definition
					attributeValue[i].imageURL="Images/city.svg";
				}
				
				return attributeValue;				

			}						
	

			//Define and update data on map
			this.onDataUpdate = dataUpdate;
		
			function dataUpdate(data){
			
					var ProcessedData=convertData(data)
					if (!ProcessedData) return;
					imageSeries.data=ProcessedData;
					
				}	
			};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
