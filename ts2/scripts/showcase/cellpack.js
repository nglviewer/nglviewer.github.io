
var i = 0

function handleIngredients (ingredients) {
  Object.keys(ingredients).forEach(function (name) {
    var ig = ingredients[name]
    var pdbName = ig.source.pdb
    console.log(pdbName)
    var url
    if (pdbName.length === 4) {
      url = 'rcsb://' + pdbName
    } else {
      url = 'https://raw.githubusercontent.com/mesoscope/cellPACK_data/master/cellPACK_database_1.1.0/other/' + pdbName
    }
    stage.loadFile(url).then(function (comp) {
      var matrixList = []
      ig.results.forEach(function (r) {
        var m = new NGL.Matrix4()
        var p = new NGL.Vector3(r[0][0], r[0][1], r[0][2])
        var q = new NGL.Quaternion(r[1][0], r[1][1], r[1][2], r[1][3])
        m.makeRotationFromQuaternion(q)
        m.transpose()
        m.setPosition(p)
        matrixList.push(m)
        i++
      })
      var assembly = new NGL.Assembly('CELLPACK')
      assembly.addPart(matrixList, [])
      comp.structure.biomolDict['CELLPACK'] = assembly
      comp.setDefaultAssembly('CELLPACK')
      var color = new NGL.Color().setRGB(
        Math.random(), Math.random(), Math.random()
      )
      comp.addRepresentation('surface', {
        colorScheme: 'uniform',
        colorValue: color.getHex(),
        surfaceType: 'sas',
        probeRadius: 1.4,
        scaleFactor: 0.05,
        useWorker: true
      })
      console.log(i)
    })

    // ig.results.forEach(function(r){
    //   shape.addTetrahedron(r[0], [ 0, 1, 0 ], 2, [ 1, 0, 0 ], [ 1, 0, 0 ])
    // })
  })
}

// var shape = new NGL.Shape('shape', { dashedCylinder: true })

NGL.autoLoad('data://HIV-1_0.1.6-8_mixed_radii_pdb.json').then(function (file) {
  var compartments = file.data.compartments

  Object.keys(compartments).forEach(function (name) {
    var c = compartments[name]
    if (c.interior) handleIngredients(c.interior.ingredients)
    if (c.surface) handleIngredients(c.surface.ingredients)
  })

  stage.tasks.onZeroOnce(function () {
    stage.autoView()
    console.log(i)
  })

  // var shapeComp = stage.addComponentFromObject(shape)
  // shapeComp.addRepresentation('buffer')
  // shapeComp.autoView()
})
