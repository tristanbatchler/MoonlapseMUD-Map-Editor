(function () {
  var ns = $.namespace('pskl.service.palette');

  ns.PaletteService = function () {
    this.dynamicPalettes = [];
    // Exposed for tests.
    this.localStorageGlobal = window.localStorage;
  };

  ns.PaletteService.prototype.getPalettes = function () {
    var palettes = [
      {
          "id": "monlapse",
          "name": "MoonlapseMUD Palette",
          "colors": [
            "#000000",
            "#000100","#ffd2ff","#ffd3dc",
            "#ffffdc","#fffeff","#ffffff",
            "#404040","#bfbfbf","#808180",
            "#550100","#aa0100","#ff0100",
            "#ff4600","#ff8c6e","#aa8d6e",
            "#aa4600","#ff8d00","#554600",
            "#aa8d00","#ffd300","#ffd26e",
            "#ffff00","#fffe6e","#aad200",
            "#aad26e","#558d00","#aafe00",
            "#55d300","#55ff00","#aaff6e",
            "#004600","#008c00","#00d200",
            "#00ff00","#55d36e","#55ff6e",
            "#558d6e","#00d36e","#00ff6e",
            "#aaffdc","#008d6e","#00ffdc",
            "#55fedc","#aad2dc","#55d2dc",
            "#00d2dc","#00feff","#55ffff",
            "#00d3ff","#aafeff","#00476e",
            "#008ddc","#55d3ff","#558cdc",
            "#008cff","#aad2ff","#0046dc",
            "#0047ff","#558dff","#00016e",
            "#5547dc","#0000dc","#0000ff",
            "#5546ff","#55476e","#aa8ddc",
            "#5500dc","#5501ff","#aa8dff",
            "#aa46ff","#55006e","#aa47dc",
            "#aa00dc","#aa00ff","#ff00dc",
            "#ff00ff","#ff46ff","#ff8dff",
            "#aa006e","#ff47dc","#ff8ddc",
            "#aa466e","#ff006e","#ff466e"
         ]        
       }
    ];
    palettes = palettes.map(function (palette) {
      return pskl.model.Palette.fromObject(palette);
    });

    return this.dynamicPalettes.concat(palettes);
  };

  ns.PaletteService.prototype.getPaletteById = function (paletteId) {
    var palettes = this.getPalettes();
    return this.findPaletteInArray_(paletteId, palettes);
  };

  ns.PaletteService.prototype.savePalette = function (palette) {
    var palettes = this.getPalettes();
    var existingPalette = this.findPaletteInArray_(palette.id, palettes);
    if (existingPalette) {
      var currentIndex = palettes.indexOf(existingPalette);
      palettes.splice(currentIndex, 1, palette);
    } else {
      palettes.push(palette);
    }

    this.savePalettes_(palettes);

    $.publish(Events.SHOW_NOTIFICATION, [{'content': 'Palette ' + palette.name + ' successfully saved !'}]);
    window.setTimeout($.publish.bind($, Events.HIDE_NOTIFICATION), 2000);
  };

  ns.PaletteService.prototype.addDynamicPalette = function (palette) {
    this.dynamicPalettes.push(palette);
  };

  ns.PaletteService.prototype.deletePaletteById = function (id) {
    var palettes = this.getPalettes();
    var filteredPalettes = palettes.filter(function (palette) {
      return palette.id !== id;
    });

    this.savePalettes_(filteredPalettes);
  };

  ns.PaletteService.prototype.savePalettes_ = function (palettes) {
    palettes = palettes.filter(function (palette) {
      return this.dynamicPalettes.indexOf(palette) === -1;
    }.bind(this));
    this.localStorageGlobal.setItem('piskel.palettes', JSON.stringify(palettes));
    $.publish(Events.PALETTE_LIST_UPDATED);
  };

  ns.PaletteService.prototype.findPaletteInArray_ = function (paletteId, palettes) {
    var match = null;

    palettes.forEach(function (palette) {
      if (palette.id === paletteId) {
        match = palette;
      }
    });

    return match;
  };
})();
