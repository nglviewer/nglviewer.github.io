
var strucComp;
var strucCartoon, strucBackbone;
var strucLicorice;
var strucSpacefill, strucSurface;
var strucHyperball, strucRope;

stage.loadFile( "./data/1blu.mmtf", {
    visible: false,
    name: "structure"
} ).then( function( o ){

    strucComp = o;

    strucCartoon = o.addRepresentation( "cartoon", {
        visible: false,
        side: "front"
    } );
    strucLicorice = o.addRepresentation( "licorice", {
        visible: false,
        radius: "vdw",
        scale: 0.5,
        aspectRatio: 1,
        sele: "polymer",
    } );
    strucBackbone = o.addRepresentation( "backbone", {
        visible: false
    } );
    strucSpacefill = o.addRepresentation( "spacefill", {
        visible: false,
        radius: "vdw",
        scale: 1,
        aspectRatio: 1,
        sele: "polymer",
    } );
    strucSurface = o.addRepresentation( "surface", {
        visible: false,
        sele: "polymer",
        useWorker: false,
        surfaceType: "av",
        color: "bfactor"
    } );
    strucHyperball = o.addRepresentation( "hyperball", {
        visible: false,
        sele: "polymer",
    } );
    strucRope = o.addRepresentation( "rope", {
        visible: false,
        radius: 0.7,
        scale: 1,
        color: "orange"
    } );

} );


function strucHideAll(){
    strucComp.eachRepresentation( function( repr ){
        repr.setVisibility( false );
    } );
}

function strucViewCommon(){
    var pa = strucComp.structure.getView( new NGL.Selection( ".CA" ) ).getPrincipalAxes();
    stage.animationControls.rotate( pa.getRotationQuaternion(), 0 );

    strucComp.autoView();
    stage.viewerControls.distance( -80 );
    stage.setSpin( true );

    strucHideAll();
    strucSpacefill.setParameters( { scale: 1, opacity: 1 } );
    strucSpacefill.setVisibility( true );
    strucLicorice.setParameters( { scale: 0.5, opacity: 1 } );
    strucLicorice.setVisibility( true );

    info.style.display = "block";
    info.innerText = "Spacefill";

    var ac = stage.animationControls;
    ac.timeout( () => ac.value( 1, 0.15, function( v ){
        info.innerText = "Ball+Stick";
        strucSpacefill.setParameters( { scale: v } );
        if( v < 0.5 ) strucLicorice.setParameters( { scale: v } );
    }, 3000 ), 3000 )
    .then( () => ac.timeout( function(){
        strucLicorice.setParameters( { opacity: 1 } );
        strucBackbone.setVisibility( true );
    }, 3000 ) )
    .then( () => ac.value( 1, 0, function( v ){
        strucSpacefill.setParameters( { opacity: v } );
        strucLicorice.setParameters( { opacity: v } );
        info.innerText = "Backbone";
        if( v === 0 ){
            strucSpacefill.setVisibility( false );
            strucLicorice.setVisibility( false );
        }
    }, 3000 ) )
    .then( () => ac.value( 1, 0, function( v ){
        strucCartoon.setParameters( { opacity: 1 - v } );
        strucCartoon.setVisibility( true );
        strucBackbone.setParameters( { opacity: v + 0.2 } );
        info.innerText = "Cartoon";
        if( v === 0 ){
            strucBackbone.setVisibility( false );
        }
    }, 3000 ) )
    .then( () => ac.timeout( function(){}, 2000 ) )
    .then( () => ac.value( 0, 1, function( v ){
        strucSurface.setParameters( { opacity: v } );
        strucSurface.setVisibility( true );
        info.innerText = "Surface";
    }, 3000 ) );
}

function strucViewUncommon(){
    var pa = strucComp.structure.getView( new NGL.Selection( ".CA" ) ).getPrincipalAxes();
    stage.animationControls.rotate( pa.getRotationQuaternion(), 0 );

    strucComp.autoView();
    stage.viewerControls.distance( -80 );
    stage.setSpin( true );

    strucHideAll();
    strucCartoon.setVisibility( true );

    var ac = stage.animationControls;
    ac.timeout( function(){}, 3000 )
    .then( () => ac.value( 1, 80, function( v ){
        strucRope.setSelection( "1-" + Math.round( v ) );
        strucRope.setVisibility( true );
    }, 7000 ) )
    .then( () => ac.timeout( function(){}, 3000 ) )
    .then( () => ac.value( 0, 1, function( v ){
        strucHyperball.setParameters( { opacity: v } );
        strucHyperball.setVisibility( true );
        info.innerText = "HyperBall";
    }, 3000 ) )
    .then( () => ac.zoomMove( strucComp.getCenter( "77" ), -20, 3000 ) );
}
