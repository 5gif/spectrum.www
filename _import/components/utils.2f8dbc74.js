import * as d3 from "../../_npm/d3@7.9.0/7055d4c5.js"
import * as Plot from "../../_npm/@observablehq/plot@0.6.16/e828d8c8.js";
import { resize } from "../../_observablehq/stdlib.fbe34e68.js"; 
// import {Generators} from "observablehq:stdlib";

const random = d3.randomLcg(new Date().getTime());
const x = Array.from({ length: 250 }, random);
const y = Array.from({ length: 150 }, random);

function chartFn(w,txt){
var xmin=d3.min(x)
var ymin=d3.min(y)
return   Plot.plot({
        nice: true,  
        height: 200,
        width:w!=undefined?w:null,
        axis: false,
        marks:[
          Plot.voronoi(x, { x, y: (_, i) => y[i], fill: x }),
          txt!=undefined?Plot.text([0], {x:xmin,y:ymin,dy:-20,dx:20, text:d=>txt, fill: "white" ,lineAnchor:"bottom",textAnchor:"start",fontSize:30,fontFamily:"monospace"}):null
      
        ]
      });
} 

  
export function Banner(title) {
  // const width = Generators.width(document.querySelector(el));

  return resize((width) => {
    var chart = chartFn(width, title);
    // var chart= Plot.voronoi(x, { x, y: (_, i) => y[i], fill: x }).plot({
    //     nice: true,

    //     height: 200,
    //     axis: false,
    //   });
    //   console.log(chart,chart.style.cssText)
    chart.style.cssText = "filter:brightness(.8);border-radius:30px";
    //   d3.select(chart).attr("style", "filter:brightness(.8);border-radius:30px");
    return chart;
    // return document.createElement("div").appendChild(chart);
  });

  // return (<>
  //     <div id="header" style="filter:brightness(.8);border-radius:30px">
  //       ${chart}
  //     </div>
  //     </>
  //   )
}

// d3.select(chart).attr("style", "filter:brightness(.8);border-radius:30px");