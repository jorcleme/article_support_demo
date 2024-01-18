<script>
    import { onMount } from 'svelte';
    import {ColorThief} from 'colorthief';

  

  
    const img = resolve(process.cwd(), '/src/lib/assets/assing-port-to-vlan-dall-e-2.png');
  
    onMount(async () => {
        ColorThief.getColor(img)
    .then(color => { console.log(color) })
    .catch(err => { console.log(err) })

ColorThief.getPalette(img, 5)
    .then(palette => { console.log(palette) })
    .catch(err => { console.log(err) })
    });
  
    function getContrastingColor(color) {
      const [r, g, b] = color;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? 'black' : 'white';
    }
  </script>

  