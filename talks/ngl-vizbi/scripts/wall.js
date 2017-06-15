
var wallWidth = 150;
var wallHeight = 200;
var wallDone = false;
var wallMouseTime = 0;
var hiddenImg, activeName;

function loadList( pdbList ){
    var i = 0;
    pdbList.reduce( function( acc, name ){
        return acc.then( function(){
            i += 1;
            return wallStage.loadFile( "./data/" + name + ".mmtf" )
                .then( addDiv )
                .then( prepareImage )
                .then( makeImage )
                .then( appendImage );
        } );
    }, Promise.resolve() ).then( function(){
        wallDone = true;
    } );
}

function addDiv( o ){
    var div = document.createElement( "div" );
    div.id = "div_" + o.name;
    div.style.display = "inline-block";
    div.appendChild( wallViewport );
    activeName = o.name;
    wall.appendChild( div );
    return {
        div: div,
        comp: o
    };
}

function prepareImage( data ){
    var o = data.comp;
    wallStage.eachRepresentation( function( r ){
        r.dispose();
    } );
    wallStage.defaultFileRepresentation( o );
    o.autoView();
    wallStage.autoView();
    var pa = o.structure.getPrincipalAxes();
    wallStage.animationControls.rotate( pa.getRotationQuaternion(), 0 );
    return data;
}

function showEntry( name ){
    var o = wallStage.getComponentsByName( name ).list[ 0 ];
    prepareImage( { comp: o } );
}

function makeImage( data ){
    return wallStage.makeImage().then( function( imgBlob ){
        data.imgBlob = imgBlob;
        return data;
    } );
}

function activateEntry( name ){
    if( !wallDone || activeName === name ) return;
    var img = document.getElementById( "img_" + name );
    var div = document.getElementById( "div_" + name );
    img.style.display = "none";
    div.appendChild( wallViewport );
    activeName = name;
    if( hiddenImg ) hiddenImg.style.display = "inline-block";
    hiddenImg = img;
    showEntry( name );
}

function appendImage( data ){
    var div = data.div;
    var name = data.comp.name;
    var imgBlob = data.imgBlob;

    var objectURL = URL.createObjectURL( imgBlob );
    var img = document.createElement( "img" );
    img.id = "img_" + name;
    img.src = objectURL;
    img.style.width = wallWidth + "px";
    img.style.height = wallHeight + "px";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.title = name;
    img.style.display = "none";
    var activate = function( e ){
        if( e.buttons === 0 ) activateEntry( name );
    };
    img.addEventListener( "mouseup", activate );
    img.addEventListener( "mousemove", activate );
    if( hiddenImg ) hiddenImg.style.display = "inline-block";
    hiddenImg = img;
    div.appendChild( img );
}


var wallViewport = document.createElement( "div" );
wallViewport.style.display = "inline-block";
wallViewport.style.width = wallWidth + "px";
wallViewport.style.height = wallHeight + "px";
document.body.appendChild( wallViewport );
var wallStage = new NGL.Stage( wallViewport, {
    backgroundColor: "white",
    tooltip: false
} );
wallStage.mouseObserver.handleScroll = false;
counter.listen( wallStage.tasks );

var wallIdList = [
    "1FUB", "1G3C",
    "1JYW", "1M5X", "2N2N", "2R3Z", "3A71", "3AEV", "3LNB", "3N5H",
    "3STK", "4D8Y", "4F8M", "4M4E", "4N99", "4R3O", "5BXQ", "5CCW"
];

loadList( wallIdList );

document.addEventListener( "mousemove", function( e ){
    wallMouseTime = performance.now();
}, false );

setInterval( function(){
    if( !wallDone || wall.style.display === "none" || 
            performance.now() - wallMouseTime < 1000 ) return;
    var idx = Math.round( Math.random() * ( wallIdList.length - 1 ) );
    var name = wallIdList[ idx ] + ".mmtf";
    console.log( idx, name );
    activateEntry( name );
    wallStage.setSpin( true );
}, 3000 );
