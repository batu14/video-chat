export const handleClickOutside = (event: MouseEvent, ref: React.RefObject<HTMLElement>, callback: () => void) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
    }
};
