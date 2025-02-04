export function pannable(node) {
    let x;
    let y;

    function handleTouchend(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
            new CustomEvent('panend', {
                detail: { x, y }
            })
        );

        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('mouseup', handleMouseup);
    }

    function handleTouchmove(event) {
        const dx = event.clientX - x;
        const dy = event.clientY - y;

        node.dispatchEvent(
            new CustomEvent('panmove', {
                detail: { x, y, dx, dy }
            })
        );
    }

    function handleTouchStart(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(new CustomEvent('panstart'), {
            detail: { x, y }
        });

        window.addEventListener('touchmove', handleTouchmove);
        window.addEventListener('touchend', handleTouchend);
    }

    function handleMousedown(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
            new CustomEvent('panstart', {
                detail: { x, y }
            })
        );

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(event) {
        const dx = event.clientX - x;
        const dy = event.clientY - y;
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
            new CustomEvent('panmove', {
                detail: { x, y, dx, dy }
            })
        );
    }

    function handleMouseup(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
            new CustomEvent('panend', {
                detail: { x, y }
            })
        );
        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('mouseup', handleMouseup);
    }

    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('touchstart', handleTouchStart);
    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
            node.removeEventListener('touchstart', handleTouchStart);
        }
    };
}
