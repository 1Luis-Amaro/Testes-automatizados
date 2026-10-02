import clsx from 'clsx'; // Importo o clsx para combinar classes CSS condicionalmente
import { useId } from 'react'; // Importo o useId para criar IDs únicos e estáveis

export type InputTextProps = { // Crio type para props, dessa forma padronizo meu código e crio regras
  labelText?: string; // labelText: opcional, deve ser uma string (rótulo do input)
  errorMessage?: string; // errorMessage: opcional, deve ser uma string (mensagem de erro)
} & React.ComponentProps<'input'>; // E além dessas duas propriedades, herda TODAS as props nativas do elemento <input> (type, placeholder, disabled, etc)

export function InputText({ // Função do componente InputText
  labelText = '', // labelText: valor padrão é string vazia (se não for passado)
  errorMessage = '', // errorMessage: valor padrão é string vazia (se não for passado)
  ...props // Pego todas as outras props passadas do input do react (type, placeholder, disabled, etc)
}: InputTextProps) { // Falo que essa função é do type InputTextProps

  const id = useId(); // Cria um ID único e estável para este input (evita conflitos de IDs)
  const errorId = `${id}-error`; // Cria um ID para a mensagem de erro (baseado no ID do input)

  const isInvalid = !!errorMessage; // Converte errorMessage em booleano (true se tiver erro, false se não)
  const describedBy = isInvalid ? errorId : undefined; // Se tiver erro, usa o errorId; se não, undefined
  const ariaLabel = labelText || props.placeholder; // Usa o labelText (se existir) ou o placeholder (fallback) para acessibilidade

  const inputClasses = clsx( // Combina as classes CSS condicionalmente
    'bg-white outline-0 text-base/tight', // Classes padrão do input
    'ring-2 rounded p-2 transition', // Mais classes padrão
    'disabled:bg-slate-200 disabled:text-slate-400 disabled:placeholder-slate-300', // Classes quando desabilitado
    'read-only:bg-slate-100', // Classes quando somente leitura
    isInvalid && 'ring-red-500 focus:ring-red-700 placeholder-red-200', // Classes quando inválido (erro)
    !isInvalid && 'ring-slate-400 focus:ring-blue-600 placeholder-slate-300', // Classes quando válido
    props.className, // Permite que quem usa o componente adicione classes extras
  );

  return ( // Retorno o HTML do JSX
    <div className='flex flex-col flex-1 gap-2'> {/* Container com layout flexível e espaçamento */}
      {labelText && ( // Se labelText não for vazio, renderiza o <label>
        <label className='text-sm' htmlFor={id}> {/* Label com classe 'text-sm' e associada ao input pelo ID */}
          {labelText} {/* Texto da label */}
        </label>
      )}

      <input // Elemento <input>
        {...props} // Espalha todas as props nativas (type, placeholder, disabled, etc)
        id={id} // ID único gerado pelo useId (para associar com a label)
        aria-label={ariaLabel} // Rótulo para acessibilidade (labelText ou placeholder)
        aria-invalid={isInvalid} // Indica se o input é inválido (true/false)
        aria-describedby={describedBy} // ID do elemento que descreve o input (a mensagem de erro)
        className={inputClasses} // Classes CSS combinadas
      />

      {errorMessage && ( // Se errorMessage não for vazio, renderiza o <p> de erro
        <p id={errorId} role='alert' className='text-sm text-red-500'> {/* Parágrafo com ID de erro, role='alert' e classe de erro */}
          {errorMessage} {/* Mensagem de erro */}
        </p>
      )}
    </div>
  );
}