import clsx from 'clsx';
import { Link, LinkProps } from 'react-router-dom';
import styles from './Button.module.css';

export type ButtonProps<T> = T & {
  className?: string;
  component?: React.ComponentType<T> | string;
  small?: boolean;
};

/**
 * adds button styling to a given component, by default a HTML button is used
 */
export const Button = <
  T extends {} = React.ButtonHTMLAttributes<HTMLButtonElement>
>({
  className,
  component: Component = 'button',
  small,
  ...props
}: ButtonProps<T>) => (
  <Component
    {...(props as ButtonProps<T>)}
    className={clsx(className, styles.button, { [styles.small]: small })}
  />
);

/**
 * convinient wrapper to use the react router `Link` component as a button
 */
export const LinkButton = (props: Omit<ButtonProps<LinkProps>, 'type'>) => (
  <Button {...props} component={Link} />
);
