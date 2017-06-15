
var hivComp, hivPoint, hivSurface;

stage.loadFile( "./data/3J3Q.mmtf.gz", {
    visible: false,
    name: "hiv"
} ).then( function( o ){

    hivComp = o;
    hivPoint = o.addRepresentation( "point", {
        visible: false,
    } );

    hivSurface = o.addRepresentation( "surface", {
        visible: false,
        surfaceType: "sas",
        smooth: 2,
        scaleFactor: 0.2,
        colorScheme: "chainindex",
        opaqueBack: false
    } );

    o.addRepresentation( "cartoon", {
        sele: ":f0 or :f1 or :f2 or :f3 or :f4 or :f5",
        colorScheme: "chainindex"
    } );

    o.addRepresentation( "ball+stick", {
        sele: ":f0",
        colorScheme: "element"
    } );

    o.addRepresentation( "rocket", {
        sele: ":f0",
        colorScheme: "chainindex"
    } );

} );


var hivOriFull = [1821.55,0,0,0,0,1821.55,0,0,0,0,1821.55,0,-463.35,-566.57,-498.95,1];
var hivOriSub = [-188.27,-78.18,130.6,0,-33.71,223.99,85.5,0,-148.43,48.3,-185.07,0,-327.88,-652.7,-706.81,1];

function hivPointOpacity( v ){
    hivPoint.setParameters( { opacity: v } );
}

function hivSurfaceOpacity( v ){
    hivSurface.setParameters( { opacity: v } );
}

function hivAnim(){
    info.style.display = "block";
    info.innerHTML = "<small>HIV-1 capsid (PDB ID 3J3Q)<br/>hexameric subunit, 10800 atoms</small>";

    hivPoint.setVisibility( false );
    hivSurface.setVisibility( false );
    hivPoint.setParameters( { opacity: 0 } );
    hivSurface.setParameters( { opacity: 0 } );

    var ac = stage.animationControls;
    ac.orient( hivOriSub, 0 );
    stage.setSpin( true );

    ac.timeout( function(){}, 3000 )
    .then( function(){
        hivPoint.setVisibility( true );
        return ac.value( 0, 1, hivPointOpacity, 4000 );
    } )
    .then( function(){
        info.innerHTML = "<small>HIV-1 capsid (PDB ID 3J3Q)<br/>216 hexameric and 12 pentameric subunit, ~2.4M unique atoms</small>";
        return ac.orient( hivOriFull, 4000 );
    } )
    .then( () => ac.timeout( function(){}, 5000 ) )
    .then( function(){
        hivSurface.setVisibility( true );
        return ac.value( 0, 1, hivSurfaceOpacity, 4000 );
    } );
}
