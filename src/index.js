import "./styles.scss";

const Konva = require('konva');

class CanvasEditor {
    constructor() {
        this.container = null;

    }


    init() {

        this.container = document.getElementById('container');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.stage = new Konva.Stage({
            container: 'container',
            width: this.width,
            height: this.height
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.renderText();
        this.addObjectsTransformer();
        this.bindDownloadBt();
        this.bindImageDrop();
        this.bindUploadBt();
    }

    renderText() {

        let text = new Konva.Text({
            x: 50,
            y: 50,
            fontSize: 40,
            text: 'A text with custom font.',
            draggable: true,
            width: 250,
            name: 'rect'
        });
        this.layer.add(text);
        this.layer.draw();

    }

    addObjectsTransformer() {

        this.stage.on('click tap', (e) => {
            // if click on empty area - remove all transformers
            if (e.target === this.stage) {
                this.stage.find('Transformer').destroy();
                this.layer.draw();
                return;
            }
            // do nothing if clicked NOT on our rectangles
            if (!e.target.hasName('rect')) {
                return;
            }
            // remove old transformers
            // TODO: we can skip it if current rect is already selected
            this.stage.find('Transformer').destroy();

            // create new transformer
            let tr = new Konva.Transformer();
            this.layer.add(tr);
            tr.attachTo(e.target);
            this.layer.draw();
        });
    }


    downloadURI(uri, name) {
        let link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // delete link;
    }

    bindDownloadBt() {
        document.getElementById('save').addEventListener(
            'click',
            () => {
                let dataURL = this.stage.toDataURL();
                this.downloadURI(dataURL, 'stage.png');
            },
            false
        );

    }

    loadImage(src) {
        //	Prevent any non-image file type from being read.
        if (!src.type.match(/image.*/)) {
            alert("The dropped file is not an image: ");
            return;
        }

        //	Create our FileReader and run the results through the render function.
        const reader = new FileReader();
        reader.onload = (e) => {
            this.render(e.target.result);


        };
        reader.readAsDataURL(src);
    }


    containerOnDragover() {
        this.container.classList.add('ondrag')
    }

    containerOnDragexit() {
        this.container.classList.remove('ondrag')
    }

    bindImageDrop() {
        this.container.addEventListener("dragover", (e) => {
            e.preventDefault();
            this.containerOnDragover();
        }, false);
        this.container.addEventListener("drop", (e) => {
            e.preventDefault();
            this.containerOnDragexit();
            this.loadImage(e.dataTransfer.files[0]);
        }, false);
        this.container.addEventListener("dragexit", (e) => {
            e.preventDefault();

            this.containerOnDragexit();
        }, false);

        this.container.addEventListener("dragend", (e) => {
            e.preventDefault();

            this.containerOnDragexit();
        }, false);
    }


    render(src) {
        const image = new Image();
        image.onload = () => {
            const newImage = new Konva.Image({
                image: image,
                x: 100,
                y: 100,
                draggable: true,
                name: 'rect',
            });
            this.layer.add(newImage);
            this.layer.draw();
        };
        image.src = src;
    }

    bindUploadBt() {

        const uploadFile = document.getElementById('upload');


        uploadFile.onchange = (e) => {

  
            this.loadImage(e.target.files[0]);

        }

    }

}


document.addEventListener("DOMContentLoaded", () => {
    const canvasEditor = new CanvasEditor();

    canvasEditor.init();

});