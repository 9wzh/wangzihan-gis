// 1. 初始化地图（实现缩放、平移）
const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM() // 加载OpenStreetMap底图
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([117.94, 39.07]), // 替换为你的校园经纬度
        zoom: 15
    })
});

// 2. 坐标显示功能
map.on('pointermove', function(e) {
    const lonLat = ol.proj.toLonLat(e.coordinate);
    document.getElementById('coordinate-info').innerText = 
        `当前坐标：经度 ${lonLat[0].toFixed(4)}, 纬度 ${lonLat[1].toFixed(4)}`;
});

// 3. 绘图与标注功能
let draw;
const source = new ol.source.Vector();
const vectorLayer = new ol.layer.Vector({ source: source });
map.addLayer(vectorLayer);

// 标注POI（点）
document.getElementById('draw-point').onclick = function() {
    if (draw) map.removeInteraction(draw);
    draw = new ol.interaction.Draw({
        source: source,
        type: 'Point'
    });
    map.addInteraction(draw);
    draw.on('drawend', function(e) {
        const name = prompt('请输入POI名称：');
        if (name) {
            e.feature.set('name', name);
            const style = new ol.style.Style({
                text: new ol.style.Text({
                    text: name,
                    offsetY: -15,
                    font: '12px Arial'
                })
            });
            e.feature.setStyle(style);
        }
    });
};

// 绘制路径（线）
document.getElementById('draw-line').onclick = function() {
    if (draw) map.removeInteraction(draw);
    draw = new ol.interaction.Draw({
        source: source,
        type: 'LineString'
    });
    map.addInteraction(draw);
};

// 清除绘图
document.getElementById('clear').onclick = function() {
    source.clear();
};