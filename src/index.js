import "./styles.scss";
console.log("hello world!");

const Konva = require('konva');


const container = document.getElementById('container');

var width = container.clientWidth;
var height = container.clientHeight;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

var layer = new Konva.Layer();
stage.add(layer);
let imageObject = new Image();
imageObject.onload = function () {
    var animal = new Konva.Image({
        image: imageObject,
        x:  100,
        y: 100,
        draggable: true,
        name: 'rect',
      });
      layer.add(animal);
    layer.draw();
  
 }

imageObject.src = './logo.png';




var text = new Konva.Text({
    x: 50,
    y: 50,
    fontSize: 40,
    text: 'A text with custom font.',
    draggable: true,
    width: 250
  });
  layer.add(text);
  layer.draw();



// var imageObj = new Image();
// imageObj.onload = function() {
//   var image = new Konva.Image({
//     x: 200,
//     y: 50,
//     image: imageObj,
//     width: 100,
//     height: 100
//   });
// };
// imageObj.src = './logo.png'



stage.on('click tap', function(e) {
  // if click on empty area - remove all transformers
  if (e.target === stage) {
    stage.find('Transformer').destroy();
    layer.draw();
    return;
  }
  // do nothing if clicked NOT on our rectangles
  if (!e.target.hasName('rect')) {
    return;
  }
  // remove old transformers
  // TODO: we can skip it if current rect is already selected
  stage.find('Transformer').destroy();

  // create new transformer
  var tr = new Konva.Transformer();
  layer.add(tr);
  tr.attachTo(e.target);
  layer.draw();
});


function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // delete link;
  }

  document.getElementById('save').addEventListener(
    'click',
    function() {
      var dataURL = stage.toDataURL();
      downloadURI(dataURL, 'stage.png');
    },
    false
  );

  var uploadFile = document.getElementById('upload');


uploadFile.onchange = e => { 

   // getting a hold of the file reference
//    let file = e.target.files[0]; 
loadImage(e.target.files[0]);
//    // setting up the reader
//    let reader = new FileReader();
//    reader.readAsText(file,'UTF-8');

//    // here we tell the reader what to do when it's done reading...
//    reader.onload = readerEvent => {
//       var content = readerEvent.target.result; // this is the content!
//       console.log( content );
//    }

}


  function loadImage(src){
	//	Prevent any non-image file type from being read.
	if(!src.type.match(/image.*/)){
		console.log("The dropped file is not an image: ", src.type);
		return;
	}

	//	Create our FileReader and run the results through the render function.
	var reader = new FileReader();
	reader.onload = function(e){
        render(e.target.result);
        
        
	};
	reader.readAsDataURL(src);
};

const containerOnDragover = () => {
    container.classList.add('ondrag')
}

const containerOnDragexit = () => {
    container.classList.remove('ondrag')
}



container.addEventListener("dragover", function(e){e.preventDefault();
    containerOnDragover();
}, false);
container.addEventListener("drop", function(e){
    e.preventDefault(); 
    containerOnDragexit();
	loadImage(e.dataTransfer.files[0]);
}, false);
container.addEventListener("dragexit", function(e){e.preventDefault();

    containerOnDragexit();
}, false);

container.addEventListener("dragend", function(e){e.preventDefault();

    containerOnDragexit();
}, false);






var MAX_HEIGHT = 1000;
function render(src){
	var image = new Image();
	image.onload = function(){
        var animal1 = new Konva.Image({
            image: image,
            x:  100,
            y: 100,
            draggable: true,
            name: 'rect',
          });
          layer.add(animal1);
        layer.draw();
	};
	image.src = src;
}