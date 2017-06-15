
var xrayStruc, xray2fofc, xrayFofc;
var xrayStrucLicorice, xray2fofcSurf, xrayFofcSurf, xrayFofcSurfNeg;

Promise.all( [
    stage.loadFile( "./data/3nzd.cif", { visible: false, name: "xray" } ),
    stage.loadFile( "./data/3nzd.ccp4.gz", { visible: false, name: "xray" } ),
    stage.loadFile( "./data/3nzd_diff.ccp4.gz", { visible: false, name: "xray" } )
] ).then( function( ol ){

    xrayStruc = ol[ 0 ];
    xray2fofc = ol[ 1 ];
    xrayFofc = ol[ 2 ];

    xrayStrucLicorice = xrayStruc.addRepresentation( "licorice", {
        colorValue: "yellow",
        roughness: 1.0
    } );

    xray2fofcSurf = xray2fofc.addRepresentation( "surface", {
        color: "skyblue",
        isolevel: 1.5,
        boxSize: 6,
        useWorker: false,
        contour: true,
        opaqueBack: false
    } );

    xrayFofcSurf = xrayFofc.addRepresentation( "surface", {
        color: "lightgreen",
        isolevel: 3,
        boxSize: 6,
        useWorker: false,
        contour: true,
        opaqueBack: false
    } );
    xrayFofcSurfNeg = xrayFofc.addRepresentation( "surface", {
        color: "tomato",
        isolevel: 3,
        negateIsolevel: true,
        boxSize: 6,
        useWorker: false,
        contour: true,
        opaqueBack: false
    } );

} );


function xrayView(){
    info.style.display = "block";
    info.innerText = "dihydrofolate reductase (PDB ID 3NZD)";

    var pa = xrayStruc.structure.getView( new NGL.Selection( ".CA" ) ).getPrincipalAxes();
    stage.animationControls.rotate( pa.getRotationQuaternion(), 0 );

    xrayStruc.autoView();
    stage.viewerControls.distance( -80 );
    stage.setSpin( true );

    var contourParams = {
        contour: true,
        flatShaded: false,
        opacity: 1,
        metalness: 0,
        wireframe: false
    };

    var flatParams = {
        contour: false,
        flatShaded: true,
        opacity: 0.35,
        metalness: 0.2,
        wireframe: false
    };
    stage.getRepresentationsByName( { comp: "xray", repr: "surface" } )
            .setParameters( contourParams );

    var ac = stage.animationControls;
    ac.timeout( function(){}, 5000 )
        .then( function(){
            ac.value( 99.1, 99.9, function( v ){
                stage.setFocus( v );
            }, 3000 );
            return ac.zoomMove( xrayStruc.getCenter( "188.N9A" ), -20, 3000 ) 
        } )
        .then( () => ac.timeout( function(){
            stage.getRepresentationsByName( { comp: "xray", repr: "surface" } )
                .setParameters( flatParams );
        }, 3000 ) );
}
