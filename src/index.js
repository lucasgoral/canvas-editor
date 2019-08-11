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
        this.selectedFont = "Arial";


        this.stage = new Konva.Stage({
            container: 'container',
            width: this.width,
            height: this.height
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.addObjectsTransformer();
        this.bindDownloadBt();
        this.bindImageDrop();
        this.bindUploadBt();
        this.bingBgSelector();
        this.bindTextForm();

    }

    bindTextForm() {


        const textInput = document.getElementById('text-input');

        [...document.querySelectorAll('.radio')[0].querySelectorAll('label')].forEach((el) => {
            el.addEventListener('click', () => {

                this.selectedFont = el.querySelectorAll('input')[0].value;
            })
        });

        document.getElementById('add-text').addEventListener('click', (e) => {
            e.preventDefault();

            let inputValue = textInput.value;
            inputValue = inputValue.trim();
            if (inputValue) {




                this.renderText(inputValue);
                textInput.value = '';
            }
        })
    }

    renderText(inputValue) {

        let text = new Konva.Text({
            x: 50,
            y: 190,
            fontSize: 20,
            text: inputValue,
            draggable: true,
            width: 300,
            name: 'transformableObject'
        });

        text.fontFamily(this.selectedFont);
        text.align('center');
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
            if (!e.target.hasName('transformableObject')) {
                return;
            }
            // remove old transformers
            // TODO: we can skip it if current rect is already selected
            this.stage.find('Transformer').destroy();

            // create new transformer
            let tr = new Konva.Transformer({
                rotateEnabled: false
            });

            tr.attachTo(e.target);
            // add delete button
            e.target.moveToTop();



            const deleteBtImage = new Image();

            deleteBtImage.onload = () => {


                const deleteButton = new Konva.Image({
                    image: deleteBtImage,
                    x: -42,
                    y: 0,
                    width: 32,
                    height: 32


                });
                tr.add(deleteButton);

                this.layer.draw();

                deleteButton.on('click', () => {
                    tr.destroy();
                    e.target.destroy();
                    this.layer.draw();


                })






            };
            deleteBtImage.src = '/assets/delete_icon.svg';



            this.layer.add(tr);
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

    }

    bindDownloadBt() {
        document.getElementById('save').addEventListener(
            'click',
            () => {
                this.stage.find('Transformer').destroy();

                let dataURL = this.stage.toDataURL({
                    pixelRatio: 2
                });
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

        let itemURL = '';
        document
            .getElementById('drag-items')
            .addEventListener('dragstart', function (e) {
                itemURL = e.target.src;
            });
        this.container.addEventListener("dragover", (e) => {
            e.preventDefault();
            this.containerOnDragover();
        }, false);
        this.container.addEventListener("drop", (e) => {
            e.preventDefault();
            this.containerOnDragexit();
            if (e.dataTransfer.files[0]) {
                this.loadImage(e.dataTransfer.files[0]);
            } else if (itemURL) {
                console.log(itemURL);
                this.render(itemURL);
            }
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

            const imageRatio = image.height / image.width;
            const newWidth = 100;
            const newHeight = newWidth * imageRatio;


            const newImage = new Konva.Image({
                image: image,
                x: 100,
                y: 100,
                width: newWidth,
                height: newHeight,
                draggable: true,
                name: 'transformableObject',
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

    deleteBackground() {

        this.stage.find('.background').destroy();
        this.layer.draw();
    }

    setBackground(src) {
        this.stage.find('.background').destroy();
        const image = new Image();

        image.onload = () => {

            const imageRatio = image.height / image.width;
            const newWidth = 400;
            const newHeight = newWidth * imageRatio;


            const currentBackground = new Konva.Image({
                image: image,
                x: 0,
                y: 0,
                width: newWidth,
                height: newHeight,
                draggable: false,
                name: 'background',
            });
            this.layer.add(currentBackground);
            currentBackground.moveToBottom();
            this.layer.draw();
        };
        image.src = src;

    }

    bingBgSelector() {
        const backgrounds = document.getElementById('backgrounds').getElementsByTagName('img');


        [...backgrounds].forEach((element) => {
            element.addEventListener('click', () => {




                this.setBackground(element.src);
            });
        })

        document.getElementById('delete').addEventListener('click', () => {
            this.deleteBackground();
        });
    }

}


document.addEventListener("DOMContentLoaded", () => {
    const canvasEditor = new CanvasEditor();

    canvasEditor.init();

});