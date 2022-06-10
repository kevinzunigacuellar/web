import { createSignal, createEffect, Switch, Show, Match } from 'solid-js'

export default function Tictactoe() {
  const [turn, setTurn] = createSignal('X')
  const [board, setBoard] = createSignal(['', '', '', '', '', '', '', '', ''])
  const [winner, setWinner] = createSignal('')

  const handleClick = (id) => {
    if (board()[id()] !== '' || winner()) {
      return
    }
    setBoard(board().map((_, i) => (i === id() ? turn() : _)))
    setTurn(turn() === 'X' ? 'O' : 'X')
  }

  createEffect(() => {
    if (!board().includes('')) {
      setWinner('Draw')
    }
    checkForWinner()
  })

  const handleReset = () => {
    setBoard(['', '', '', '', '', '', '', '', ''])
    setTurn('X')
    setWinner('')
  }

  const checkForWinner = () => {
    // check rows
    if (board()[0] !== '' && board()[0] === board()[1] && board()[0] === board()[2]) {
      setWinner(board()[0])
    }
    if (board()[3] !== '' && board()[3] === board()[4] && board()[3] === board()[5]) {
      setWinner(board()[3])
    }
    if (board()[6] !== '' && board()[6] === board()[7] && board()[6] === board()[8]) {
      setWinner(board()[6])
    }
    // check columns
    if (board()[0] !== '' && board()[0] === board()[3] && board()[0] === board()[6]) {
      setWinner(board()[0])
    }
    if (board()[1] !== '' && board()[1] === board()[4] && board()[1] === board()[7]) {
      setWinner(board()[1])
    }
    if (board()[2] !== '' && board()[2] === board()[5] && board()[2] === board()[8]) {
      setWinner(board()[2])
    }
    // check diagonals
    if (board()[0] !== '' && board()[0] === board()[4] && board()[0] === board()[8]) {
      setWinner(board()[0])
    }
    if (board()[2] !== '' && board()[2] === board()[4] && board()[2] === board()[6]) {
      setWinner(board()[2])
    }
  }

  return (
    <div>
      <ul class="relative grid grid-cols-3 sm:max-w-xs w-full gap-2 p-2">
        <For each={board()}>
          {(square, i) => (
            <li
              class="w-full h-auto aspect-square rounded-md bg-white dark:bg-zinc-800 shadow flex items-center dark:border-t dark:border-zinc-700 justify-center text-zinc-400 dark:text-gray-500 transition-colors"
              onClick={() => handleClick(i)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-auto w-20 stroke-2 stroke-current fill-transparent"
                viewBox="0 0 24 24"
              >
                <Switch fallback={null}>
                  <Match when={square === 'X'}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </Match>
                  <Match when={square === 'O'}>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </Match>
                </Switch>
              </svg>
            </li>
          )}
        </For>
        <Switch fallback={null}>
          <Match when={winner() === 'X'}>
            <div class="absolute flex flex-col justify-center items-center bg-gray-100/30 dark:bg-zinc-900/30 backdrop-blur w-full h-full rounded-lg transition-all">
              <p class="pb-4 text-zinc-600 dark:text-zinc-400">Congratulations X</p>
              <button
                class="inline-block rounded-md px-5 py-2 font-semibold bg-blue-200 text-blue-700 dark:bg-indigo-700 dark:text-indigo-200 transition-colors"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </Match>
          <Match when={winner() === 'O'}>
            <div class="absolute flex flex-col justify-center items-center bg-gray-100/30 dark:bg-zinc-900/30 backdrop-blur w-full h-full rounded-lg transition-all">
              <p class="pb-4 text-zinc-600 dark:text-zinc-400">Congratulations O</p>
              <button
                class="inline-block rounded-md px-5 py-2 font-semibold bg-blue-200 text-blue-700 dark:bg-indigo-700 dark:text-indigo-200 transition-colors"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </Match>
          <Match when={winner() === 'Draw'}>
            <div class="absolute flex flex-col justify-center items-center bg-gray-100/30 dark:bg-zinc-900/30 backdrop-blur w-full h-full rounded-lg transition-all">
              <p class="pb-4 text-zinc-600 dark:text-zinc-400">It's a draw</p>
              <button
                class="inline-block rounded-md px-5 py-2 font-semibold bg-blue-200 text-blue-700 dark:bg-indigo-700 dark:text-indigo-200 transition-colors"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </Match>
          <button
            class="inline-block rounded-md px-5 py-2 font-semibold bg-blue-200 text-blue-700"
            onClick={handleReset}
          >
            Reset
          </button>
        </Switch>
      </ul>
    </div>
  )
}
