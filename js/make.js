window.onload = function () {
    //定义画布
    let canvas = new fabric.Canvas('c');
    var height = window.innerHeight;

    var h = $('.header-section').height();

    $('.pic').height(height - h);
    $('.operation').height(height - h);
    $('button').mousedown(function () {
        $(this).css("color", "#faa43d");
    });
    $('button').mouseup(function () {
        $(this).css("color", "#565A5A");
    });

    //改变选框样式
    fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: '#ccc',
        cornerStrokeColor: '#ccc',
        borderColor: '#ccc',
        cornerSize: 10,

        cornerStyle: 'circle',
        borderDashArray: [3, 3]
    });


    //添加图片
//    $('img').addClass('show-list');
//    $('.show-list').click(function () {
//        let path = $(this).attr("src");
//        $('#show').show();
//        $('#show').attr("src", path);
//
//    })

    function getLocation(x, y) {
        var bbox = c.getBoundingClientRect();
        return {
            x: (x - bbox.left) * (c.width / bbox.width),
            y: (y - bbox.top) * (c.height / bbox.height)
        };
    }

    function add() {
        let path = $('img').attr("src");
        fabric.Image.fromURL(path, function (oImg) {

            canvas.add(oImg);

        });

    }
    $('i').click(function () {
        add();
    });
    //拖拽图片
    var srcList = document.querySelectorAll('img'); //找到全部img元素  
    for (var i = 0; i < srcList.length; i++) { //遍历img元素  
        var p = srcList[i];
        p.ondragstart = function (e) { //开始拖动源对象  
            e.dataTransfer.setData('PlaneID', this.id); //保存数据--该img元素的id  
        }
        p.ondrag = function () {}
        p.ondragend = function () {}
    }

    //为目标对象添加事件监听 —— 删除拖动的源对象  

    trash.ondragover = function (e) { //源对象在悬停在目标对象上时  
        e.preventDefault(); //阻止默认行为，使得drop可以触发  
    }
    //获取鼠标位置

    trash.ondrop = function (e) { //源对象松手释放在了目标对象中  

        var id = e.dataTransfer.getData('PlaneID'); //得到数据--id值  
        var p = $('#' + id); //根据id值找到相关的元素
        var path = p.attr("src");
        var location = getLocation(e.clientX, e.clientY);
        fabric.Image.fromURL(path, function (oImg) {
            var top = location.y - oImg.get('height') / 2; //设置位置
            　　
            var left = location.x - oImg.get('width') / 2;
            oImg.set({
                top: top,
                left: left,
            });
            canvas.add(oImg);
            canvas.setActiveObject(oImg);
        });


    }


    //图像编辑 
    var getSelected = function () {
        return canvas.getActiveObject();
    };

    var removeSelected = function () {
        var activeObjects = canvas.getActiveObjects();
        canvas.discardActiveObject()
        if (activeObjects.length) {
            canvas.remove.apply(canvas, activeObjects);
        }
    };
    var sendBackwards = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendBackwards(activeObject);
        }
    };

    var sendToBack = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendToBack(activeObject);
        }
    };

    var bringForward = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringForward(activeObject);
        }
    };

    var bringToFront = function () {
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringToFront(activeObject);
        }
    };

    var lock = function () {
        var activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        if (activeObject) {
            activeObject.lockMovementX = true;
            activeObject.lockMovementY = true;
            activeObject.lockScalingX = true;
            activeObject.lockScalingY = true;
            activeObject.lockRotation = true;
        }

    };
    var unlock = function () {
        var activeObject = canvas.getActiveObject();
        activeObject.lockMovementX = false;
        activeObject.lockMovementY = false;
        activeObject.lockScalingX = false;
        activeObject.lockScalingY = false;
        activeObject.lockRotation = false;
    };
    var shadowify = function () {
        var obj = canvas.getActiveObject();
        if (!obj) return;

        if (obj.shadow) {
            obj.shadow = null;
        } else {
            obj.setShadow({
                color: 'rgba(0,0,0,0.3)',
                blur: 10,
                offsetX: 5,
                offsetY: 5,
            });
        }
        canvas.renderAll();
    };      
//     var consoleJSONValue = ();
 
//
//   var getConsoleJSON = function() {
//     return consoleJSONValue;
//   };
//   var setConsoleJSON = function(value) {
//     consoleJSONValue = value;
//   };
   var json={};
   var saveJSON = function() {
       json=JSON.stringify(canvas);
       alert(json);
   }
   var loadJSON = function() {     
       canvas.loadFromJSON(json, function(){
       canvas.renderAll();
     });
   };


    $('#delete').click(function () {
        removeSelected();
    });
    $('#tobottom').click(function () {
        sendToBack();
    });
    $('#down').click(function () {
        sendBackwards();
    });
    $('#up').click(function () {
        bringForward();
    });
    $('#totop').click(function () {
        bringToFront();
    });
    $('#shadow').click(function () {
        shadowify();
    });
    $('#save').click(function () {
       saveJSON();
    })
    $('#load').click(function(){
        loadJSON();
    })
    var flag = true;
    $('#lock').on('click', function () {
        var cur = $(this).html();
        var activeObject = canvas.getActiveObject;
        if (flag && activeObject) {
            $(this).html('<i class="fas fa-lock fa-lg"></i>');
            lock();
            flag = false;
        } else if (activeObject) {
            $(this).html('<i class="fas fa-lock-open fa-lg"></i>');
            unlock();
            flag = true;
        }
    });



    $(document).keydown(function (event) {　　
        var e = event || window.event;　　
        var k = e.keyCode || e.which;　　
        switch (k) {　　　　
            case 46:
                removeSelected();　　　　
                break;　　
        }

        return false;

    });

    var c = document.getElementById('c');

    function downloadimage(event) {
        // 图片导出为 png 格式
        var type = 'png';
        // 返回一个包含JPG图片的<img>元素
        var img_png_src = c.toDataURL("image/png"); //将画板保存为图片格式的函数
        // 加工image data，替换mime type
        imgData = img_png_src.replace(_fixType(type), 'image/octet-stream');
        // 下载后的问题名
        var filename = '我的作品' + (new Date()).getTime() + '.' + type;
        // download
        saveFile(imgData, filename);
    }

    /**
     * 在本地进行文件保存
     * @param  {String} data     要保存到本地的图片数据
     * @param  {String} filename 文件名
     */
    var saveFile = function (data, filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    };

    /**
     * 获取mimeType
     * @param  {String} type the old mime-type
     * @return the new mime-type
     */
    var _fixType = function (type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };
    $('#import').click(function () {
        downloadimage();
    })
}
 
//提示
    
$("#3d").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'3D预览',
            gravity:'bottom'
        });
    })
$("#delete").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'删除',
            gravity:'bottom'
        });
    })
                $("#lock").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'锁定',
            gravity:'bottom'
        });
    })
                $("#import").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'导出',
            gravity:'bottom'
        });
    })
                $("#tobottom").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'移到底层',
            gravity:'bottom'
        });
    })
                $("#down").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'下移一层',
            gravity:'bottom'
        });
    })
                $("#up").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'上一一层',
            gravity:'bottom'
        });
    })
                $("#totop").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'移至顶层',
            gravity:'bottom'
        });
    })
                $("#single").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'单品',
            gravity:'bottom'
        });
    })

                $("#product").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'作品',
            gravity:'bottom'
        });
    })

                $("#collection").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'收藏',
            gravity:'bottom'
        });
    })

                $("#author").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'作者',
            gravity:'bottom'
        });
    })

                $("#search").mouseover(function(){
        var _this = $(this);
        _this.justToolsTip({
            animation:"moveInBottom",
            //width:"300px",
            contents:'搜索',
            gravity:'bottom'
        });
    })
