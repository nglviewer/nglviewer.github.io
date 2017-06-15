
var volComp;

stage.loadFile( "./data/emd_6224.map.gz", {
    visible: false,
    name: "volume"
} ).then( function( o ){

    volComp = o;

    volSurf = o.addRepresentation( "surface", {
        visible: false,
        isolevel: 6
    } );

    volSlice = o.addRepresentation( "slice", {
        visible: false,
        position: 50
    } );

    volPoint = o.addRepresentation( "dot", {
        visible: false,
        color: "darkgrey"
    } );

} );

var volOri = [0.12,-2.23,289.28,0,-289.29,0.3,0.12,0,-0.3,-289.28,-2.23,0,-0.05,-1.14,0.5,1];

function volumeView(){
    volComp.autoView();
    var ac = stage.animationControls;
    ac.orient( volOri, 0 )
    stage.setSpin( true );
    stage.viewerControls.distance( -300 );

    volPoint.setVisibility( true );

    var ac = stage.animationControls;
    ac.timeout( function(){ volSlice.setVisibility( true ); }, 5000 )
        .then( () => ac.timeout( function(){
            volSurf.setVisibility( true ); 
        }, 5000 ) )
        .then( () => ac.timeout( function(){
            volSlice.setVisibility( false );
            volSurf.setVisibility( false );
        }, 5000 ) )
        .then( () => ac.timeout( function(){
            volSlice.setVisibility( true ); 
        }, 5000 ) )
        .then( () => ac.timeout( function(){
            volSurf.setVisibility( true ); 
        }, 5000 ) );
}
