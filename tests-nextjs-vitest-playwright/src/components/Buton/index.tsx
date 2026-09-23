import clsx from 'clsx'; // Importa a biblioteca clsx para combinar classes CSS condicionalmente

type ButtonVariants = 'default' | 'ghost' | 'danger'; // Crio um type que define as variantes permitidas do botão
type ButtonSizes = 'sm' | 'md' | 'lg'; // Crio um type que define os tamanhos permitidos do botão

type ButtonProps = {  // Crio um type que define as props do botão
  variant?: ButtonVariants; /// variant: opcional, deve ser uma das variantes ('default', 'ghost', 'danger')
  size?: ButtonSizes; // size: opcional, deve ser um dos tamanhos ('sm', 'md', 'lg')
} & React.ComponentProps<'button'>;  // aqui falo que esse meu type Herda TODAS as props nativas do elemento <button> (onClick, disabled, type, etc)

export function Button({ // Função do componente Button
  variant = 'default', // variant: valor padrão é 'default' (se não for passado) 
  size = 'md', // size: valor padrão é 'md' (se não for passado)
  ...props // Pega todas as outras props que foram passadas (onClick, disabled, etc)
}: ButtonProps) {// Aplica o type ButtonProps na função 
  const buttonVariants: Record<ButtonVariants, string> = { // Objeto que mapeia cada variante para uma string de classes CSS
    default: clsx('bg-blue-600 hover:bg-blue-700 text-blue-100'), // Variante padrão: fundo azul
    ghost: clsx('bg-slate-300 hover:bg-slate-400 text-slate-950'), // Variante ghost: fundo cinza
    danger: clsx('bg-red-600 hover:bg-red-700 text-red-100'), // Variante danger: fundo vermelho (perigo)
  };

  const buttonSizes: Record<ButtonSizes, string> = { // Objeto que mapeia cada tamanho para uma string de classes CSS
    sm: clsx( // Tamanho pequeno (sm)
      'text-xs/tight', // Texto pequeno
      'py-1', // Padding vertical
      'px-2', // Padding horizontal
      'rounded-sm', // Bordas arredondadas pequenas
      '[&_svg]:w-3 [&_svg]:h-3 gap-1', // Ícones pequenos e gap de 1
    ),
    md: clsx( // Tamanho médio (md)
      'text-base/tight', // Texto médio
      'py-2', // Padding vertical
      'px-4', // Padding horizontal
      'rounded-md', // Bordas arredondadas médias
      '[&_svg]:w-4 [&_svg]:h-4 gap-2', // Ícones médios e gap de 2
    ),
    lg: clsx( // Tamanho grande (lg)
      'text-lg/tight', // Texto grande
      'py-4', // Padding vertical
      'px-6', // Padding horizontal
      'rounded-lg', // Bordas arredondadas grandes
      '[&_svg]:w-5 [&_svg]:h-5 gap-3', // Ícones grandes e gap de 3
    ),
  };

  const buttonClasses = clsx( // Combina todas as classes em uma única string
    buttonVariants[variant], // Pega as classes da variante escolhida (ex: 'bg-blue-600')
    buttonSizes[size], // Pega as classes do tamanho escolhido (ex: 'text-base')
    'flex items-center justify-center cursor-pointer', // Classes padrão do botão
    'transition', // Adiciona transição suave
    'disabled:bg-slate-200', // Fundo cinza quando desabilitado
    'disabled:text-slate-400', // Texto cinza quando desabilitado
    'disabled:cursor-not-allowed', // Cursor não permitido quando desabilitado
    props.className, // Permite que quem usa o componente adicione classes extras
  );

  return <button {...props} className={buttonClasses} />; // Retorna o botão HTML com as props e as classes combinadas
}