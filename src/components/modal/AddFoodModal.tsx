import { useState } from 'react';
import { createFood } from '@/services/foodService';

interface AddFoodModalProps {
  modalId: string;
  onCreated: () => Promise<void> | void;
}

export function AddFoodModal({
  modalId,
  onCreated,
}: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 1. Estado para controlar a mensagem de erro
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSave() {
    try {
      setErrorMessage(null);

      // 2. Validações do Front-end
      if (!name.trim()) {
        setErrorMessage('O nome do alimento não pode estar vazio.');
        return;
      }

      if (caloriesPer100g === '' || carbsPer100g === '' || proteinPer100g === '' || fatPer100g === '') {
        setErrorMessage('Preencha todos os valores nutricionais.');
        return;
      }

      if (Number(caloriesPer100g) < 0 || Number(carbsPer100g) < 0 || Number(proteinPer100g) < 0 || Number(fatPer100g) < 0) {
        setErrorMessage('Os valores nutricionais não podem ser negativos.');
        return;
      }

      setLoading(true);

      await createFood({
        name,
        caloriesPer100g: Number(caloriesPer100g),
        carbsPer100g: Number(carbsPer100g),
        proteinPer100g: Number(proteinPer100g),
        fatPer100g: Number(fatPer100g),
      });

      // Limpa tudo após o sucesso
      setName('');
      setCaloriesPer100g('');
      setCarbsPer100g('');
      setProteinPer100g('');
      setFatPer100g('');
      setErrorMessage(null);

      await onCreated();

      (
        document.getElementById(
          modalId,
        ) as HTMLDialogElement
      )?.close();
    } catch (error: any) {
      // 3. Captura o erro da API (se houver)
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Ocorreu um erro inesperado ao salvar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Função para limpar erros se o usuário fechar o modal
  function handleCancel() {
    setErrorMessage(null);
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Novo alimento
        </h3>

        {/* 4. Banner visual de erro - Aparece apenas se houver erro */}
        {errorMessage && (
          <div role="alert" className="alert alert-error mt-4 py-2 rounded-lg text-sm flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3 mt-4">
          <input
            className="input input-bordered w-full"
            placeholder="Nome"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Calorias por 100g"
            value={caloriesPer100g}
            onChange={(e) =>
              setCaloriesPer100g(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Carboidratos por 100g"
            value={carbsPer100g}
            onChange={(e) =>
              setCarbsPer100g(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Proteínas por 100g"
            value={proteinPer100g}
            onChange={(e) =>
              setProteinPer100g(e.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Gorduras por 100g"
            value={fatPer100g}
            onChange={(e) =>
              setFatPer100g(e.target.value)
            }
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleCancel}>
              Cancelar
            </button>
          </form>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </dialog>
  );
}