import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

export function tooltip(node, params) {
    let tip = tippy(node, params);
    return {
        update: (newParams) => {
            tip.setProps(newParams);
        },
        destroy: () => {
            tip.destroy();
        }
    };
}
