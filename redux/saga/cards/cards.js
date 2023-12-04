import find from "lodash/find";
import { put } from "redux-saga/effects";

import { getCardsSuccess } from "../../actions/index";
import { cardsList } from "../../actions";
import { startLoader, stopLoader } from "../../../lib/global";
import { getCardAPI } from "../../../services/card";

export function* getUserCard(action) {
  const loader = (action.payload && action.payload.loader) || false;
  try {
    loader && startLoader();
    let response = yield getCardAPI();
    const cards = response.data.data;

    if (cards?.length > 0) {
      const getDefaultCard = (cards) => {
        return find(cards, { isDefault: true });
      };

      yield put(getCardsSuccess({
        status: 200,
        cards: cards,
        defaultCard: getDefaultCard(cards),
      }));
    } else {
      yield put(getCardsSuccess({
        status: 200,
        cards: [],
        defaultCard: null,
      }));
    }

    yield put(cardsList(cards))
    loader && stopLoader();
  } catch (e) {
    loader && stopLoader();
    console.error("ERROR IN getUserCard", e);
  }
}
