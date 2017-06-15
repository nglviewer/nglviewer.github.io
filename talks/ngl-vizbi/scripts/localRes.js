
var betaGalComp, localResComp, betaGalSurf;

Promise.all([
    stage.loadFile( "./data/betaGal.mrc", {
        visible: false,
        name: "localRes"
    } ),
    stage.loadFile( "./data/localResolution.mrc", {
        visible: false,
        name: "localRes",
        voxelSize: 3.54
    } )
]).then( function( l ){
    betaGalComp = l[ 0 ];
    localResComp = l[ 1 ];
    betaGalSurf = betaGalComp.addRepresentation( "surface", {
        colorVolume: localResComp.volume,
        colorScheme: "volume",
        colorScale: "rwb",
        colorReverse: true,
        colorDomain: [ 5, 17 ],
        isolevel: 2
    } );
} );


function betaGalIsolevel( v ){
    betaGalSurf.setParameters( { isolevel: v } );
}

function localResView(){
    betaGalComp.autoView();
    stage.setSpin( true );
    stage.viewerControls.distance( -300 );

    var ac = stage.animationControls;
    ac.value( 2, 7, betaGalIsolevel, 2000 )
        .then( () => ac.value( 7, 2, betaGalIsolevel, 2000 ) )
        .then( () => ac.value( 2, 7, betaGalIsolevel, 2000 ) )
        .then( () => ac.value( 7, 2, betaGalIsolevel, 2000 ) )
        .then( () => ac.value( 2, 5, betaGalIsolevel, 2000 ) );
}
