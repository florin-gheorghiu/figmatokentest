const StyleDictionaryPackage = require('style-dictionary');

StyleDictionaryPackage.registerFormat({
  name: 'css/variables',
  formatter: function (dictionary, config) {
    return `${this.selector} {
      ${dictionary.allProperties.map(prop => `  --${prop.name}: ${prop.value};`).join('\n')}
    }`
  }
});

StyleDictionaryPackage.registerTransform({
  name: 'sizes/px',
  type: 'value',
  matcher: function(prop) {
    return ["fontSize", "spacing", "borderRadius", "borderWidth", "sizing"].includes(prop.attributes.category);
  },
  transformer: function(prop) {
    return parseFloat(prop.original.value) + 'px';
  }
});

function getStyleDictionaryConfig(theme) {
  return {
    "source": [
      `input/${theme}.json`,
    ],
    "platforms": {
      "web": {
        "transforms": ["attribute/cti", "name/cti/kebab", "sizes/px"],
        "buildPath": `output/css/`,
        "files": [{
          "destination": `${theme}-variables.css`,
          "format": "css/variables",
          "selector": `.${theme}-theme`
        }]
      }
    }
  };
}

console.log('Build started...');

['tokensbrucke-htmlpagetest'].map(function (theme) {
  console.log(`\nProcessing: [${theme}]`);

  const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme));

  StyleDictionary.buildPlatform('web');

  console.log('\nEnd processing');
})

console.log('\nBuild completed!');