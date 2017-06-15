
var gpcrComp, gpcrCartoon, gpcrLigand, gpcrSurf;

stage.loadFile( "./data/3sn6.mmtf", {
    visible: false,
    name: "gpcr"
} ).then( function( o ){

    gpcrComp = o;

    gpcrCartoon = o.addRepresentation( "cartoon", {
        colorScheme: "chainname",
        colorScale: "RdYlBu"
    } );
    gpcrLigand = o.addRepresentation( "ball+stick", { sele: "ligand" } );
    gpcrSurf = o.addRepresentation( "surface", {
        visible: false,
        opacity: 0,
        sele: "polymer and :R and 1-400",
        color: "electrostatic",
        useWorker: false,
        surfaceType: "av",
        clipNear: 50,
        opaqueBack: false
    } );

} );


function gpcrView(){
    var pa = gpcrComp.structure.getView( new NGL.Selection( ".CA" ) ).getPrincipalAxes();
    stage.animationControls.rotate( pa.getRotationQuaternion(), 0 );
    gpcrComp.autoView();
    gpcrSurf.setVisibility( false );
    gpcrCartoon.setParameters( { clipNear: 0 } );
    stage.viewerControls.distance( -250 );
}

var ligOri = [-17.46,-0.42,36.45,0,-36.42,-1.31,-17.47,0,1.36,-40.39,0.19,0,-21.41,-5.76,9.62,1];

function gpcrAnim(){
    info.style.display = "block";
    info.innerText = "beta2-adrenergic receptor (PDB ID 3SN6)";
    gpcrView();
    stage.setSpin( true );
    var ac = stage.animationControls;
    ac.timeout( () => { stage.setSpin( false ) }, 20000 )
        .then( () => ac.orient( ligOri, 3000 ) )
        .then( function(){
            gpcrSurf.setVisibility( true );
            ac.value( 0, 1, function gpcrSurfOpacity( v ){
                gpcrCartoon.setParameters( { clipNear: lerp( 49.5, 50, v ) } );
                gpcrSurf.setParameters( { opacity: v } );
                info.innerText = "ligand binding pocket";
            }, 3000 );
        } )
        .then( function(){
            stage.setSpin( true );
        } );
}
