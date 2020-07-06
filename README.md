# fsNumberbox for jQuery

fsNumberbox allow you set up a text input to allow input just values integer, currency or decimals.

It has no dependency other than jQuery.

The standard fsNumberbox.js file is around 8KB when minified.


## General settings

| Setting           | Default |  Description                                                        |
|-------------------|---------|---------------------------------------------------------------------|
| digitgroupsymbol  | .       | String value '.' or ',' that indicate the thousands symbol.         |
| decimalsymbol     | ,       | String value ',' or '.' that indicate the decimal symbol.           |
| length            | 16      | Number of digits of thousands.                                      |
| decimals          | 2       | Number of digits of decimal.                                        |
| allownegative     | false   | Boolean value indicating if should be allow negatives values.       |


## Usage

Html:

```
    <input id="IntegerNumberbox" type="text" value="0"/>

    <input id="currencyNumberbox" type="text" value="0.00"/>

    <input id="currencyComaNumberbox" type="text" value="0,00"/>
```

Javascript:

```
    $("#IntegerNumberbox").fsNumberbox({ length: 10, decimals: 0 });

    $("#currencyNumberbox").fsNumberbox({ digitgroupsymbol: ',', decimalsymbol: '.', length: 14, decimals: 2 });
    
    $("#currencyComaNumberbox").fsNumberbox({ length: 14, decimals: 2 });
```


## License

fsNumberbox for jQuery is freely distributable under the terms of an MIT-style license.

Copyright notice and permission notice shall be included in all copies or substantial portions of the Software.


## Authors

William da Mota