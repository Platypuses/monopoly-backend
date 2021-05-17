import GameChanceCellDto from '../../models/responses/game/state/GameChanceCellDto';

let chancesList: GameChanceCellDto[];
let index = 0;

function getChanceList(): GameChanceCellDto[] {
  return [
    {
      cost: -15,
      text: 'Штраф за превышение скорости. Заплатите 15$',
    },
    {
      cost: -100,
      text: 'Оплата лечения. Заплатите 100$',
    },
    {
      cost: +100,
      text: 'Вы выиграли чемпионат по шахматам. Получите 100$',
    },
  ];
}

/* eslint-disable no-param-reassign */

function shuffleChanceList(
  chanceList: GameChanceCellDto[]
): GameChanceCellDto[] {
  for (let i = chanceList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chanceList[i], chanceList[j]] = [chanceList[j], chanceList[i]];
  }

  return chanceList;
}

export default {
  initChancesList(): GameChanceCellDto[] {
    chancesList = shuffleChanceList(getChanceList());
    return chancesList;
  },

  getChance(): GameChanceCellDto {
    const chance = chancesList[index];
    if (index === chancesList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }

    return chance;
  },
};
