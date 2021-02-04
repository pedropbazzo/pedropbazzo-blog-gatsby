module.exports = [{
      plugin: require('../../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":1280,"linkImagesToOriginal":true,"showCaptions":false,"markdownCaptions":false,"sizeByPixelDensity":false,"backgroundColor":"white","quality":50,"withWebp":false,"tracedSVG":false,"loading":"lazy","disableBgImageOnAlpha":false,"disableBgImage":false},
    },{
      plugin: require('../../node_modules/gatsby-theme-elemental/gatsby-browser.js'),
      options: {"plugins":[],"contentPath":"contents"},
    }]
