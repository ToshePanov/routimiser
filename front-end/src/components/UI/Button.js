import classes from './Button.module.css';

const Button = props => {
    const btnClasses = `${classes.button} ${props.className}`;

    return (
        <button className={btnClasses} type={props.type || 'button'} onClick={props.onClick}>
            {props.children}
        </button>
    )
};

export default Button;