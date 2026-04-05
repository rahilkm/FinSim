export default function Icon({ name, className = '', size, filled = false, ...props }) {
    const style = {};
    if (size) style.fontSize = size;
    if (filled) style.fontVariationSettings = "'FILL' 1";

    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={style}
            {...props}
        >
            {name}
        </span>
    );
}
