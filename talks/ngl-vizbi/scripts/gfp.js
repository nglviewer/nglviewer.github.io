
var gfpComp;

stage.loadFile( "./data/1EMA.mmtf", {
    visible: false,
    name: "gfp"
} ).then( function( o ){

    gfpComp = o;

    o.addRepresentation( "cartoon", {
        color: "white",
        smoothSheet: true,
        opacity: 0.5,
        depthWrite: false,
        side: "front",
        quality: "high"
    } );

    o.addRepresentation( "licorice", {
        sele: "64-68",
        scale: 3,
        color: "green"
    } );

    o.addRepresentation( "point", {
        sele: "64-68",
        opacity: 0.05,
        color: "green",
        useTexture: true,
        pointSize: 40,
        edgeBleach: 1,
        alphaTest: 0,
        depthWrite: false
    } );

} );


function gfpSpin(){
    var pa = gfpComp.structure.getView( new NGL.Selection( ".CA" ) ).getPrincipalAxes();
    stage.animationControls.rotate( pa.getRotationQuaternion(), 0 );
    gfpComp.autoView();
    stage.viewerControls.distance( -80 );
    stage.setSpin( true );
}
