
var dcdComp, dcdTraj;

stage.loadFile( "./data/md_1u19.gro", {
	name: "dcd",
	visible: false
} ).then( function( o ){

	dcdComp = o;

    o.addRepresentation( "cartoon", {
    	colorScheme: "residueindex",
    	colorScale: "RdYlBu",
    	colorReverse: true
    } );
    o.addRepresentation( "surface", { visible: false, lazy: true } );

    NGL.autoLoad( "./data/md_1u19.dcd.gz" ).then( function( frames ){
        dcdTraj = o.addTrajectory( frames, {
            sele: "backbone and not hydrogen"
        } );
    } );

} );


function dcdView(){
	var pa = dcdComp.structure.getView( new NGL.Selection( ".CA" ) ).getPrincipalAxes();
    stage.animationControls.rotate( pa.getRotationQuaternion(), 0 );

    info.style.display = "block";
    info.innerHTML = "<small>molecular dynamics trajectory showing<br/>temperature fluctuations of rhodopsin (PDB ID 1U19)</small>";

    dcdComp.autoView();
    stage.viewerControls.distance( -120 );
    dcdTraj.trajectory.player.timeout = 100;
    dcdTraj.trajectory.player.play();
}

function dcdStop(){
	dcdTraj.trajectory.player.stop();
}
