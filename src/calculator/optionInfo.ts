import type { BuildingType, OptionKey, RoofType } from '../types';

/** Tresci modali informacyjnych per opcja (DND-16) — hardcode we froncie, patrz CONTEXT.md. */
export const BUILDING_INFO: Record<BuildingType, string> = {
  APARTMENT_1L:
    'Model układu jednego, jednopoziomowego lokalu w budynku wielorodzinnym — pokazuje rozkład pomieszczeń bez elewacji zewnętrznej.',
  APARTMENT_2L:
    'Model układu dwupoziomowego lokalu (mieszkanie dwupoziomowe/antresola) — górny poziom zdejmowany, dzięki czemu widać układ obu pięter.',
  HOUSE_1F:
    'Parterowy dom jednorodzinny — pełna bryła z dachem, wnętrzem i, opcjonalnie, ścianami działowymi.',
  HOUSE_2F:
    'Piętrowy dom jednorodzinny — model z rozbieralnymi kondygnacjami, dzięki czemu widać układ obu pięter.',
  DUPLEX:
    'Bliźniak — dwa lustrzane lub podobne segmenty w jednej bryle, wycena obejmuje standardowy zakres do 25×25 m na segment.',
  TERRACED:
    'Zabudowa szeregowa — powtarzalne segmenty; ze względu na dużą rozpiętość rozmiarów cena jest orientacyjna ("od X zł") do czasu weryfikacji liczby segmentów.',
};

export const ROOF_INFO: Record<RoofType, string> = {
  FLAT: 'Dach płaski — bez spadku, w cenie podstawowej modelu.',
  GABLE: 'Dach dwuspadowy — klasyczny dwuspadowy kształt, najczęściej wybierany dla domów jednorodzinnych.',
  HIP: 'Dach czterospadowy — cztery połacie, bardziej złożony w druku niż dwuspadowy.',
  MULTI_HIP: 'Dach wielospadowy — nietypowa, wielopołaciowa bryła dachu, najbardziej pracochłonny wariant.',
};

export const FLOORS_INFO: Record<1 | 2, string> = {
  1: 'Model jednokondygnacyjny — jedna, nierozbieralna bryła.',
  2: 'Model dwukondygnacyjny — górna kondygnacja zdejmowana, dzięki czemu widać układ obu pięter.',
};

export const OPTION_INFO: Record<OptionKey, string> = {
  INTERIOR_WALLS:
    'Rozbicie wnętrza na pomieszczenia widoczne na modelu — pakiet standardowy, włączony domyślnie. Wyłączenie pokazuje samą bryłę i strop bez podziału na pokoje.',
  WINDOW_FRAMES: 'Ramy okienne oznaczone kontrastowym kolorem na elewacji modelu.',
  PERGOLA: 'Pergola dostawiona do bryły budynku, drukowana w kontrastowym kolorze.',
  TERRACE: 'Taras przy budynku, zaznaczony jako osobny element na podglądzie.',
  PHOTOVOLTAIC: 'Panele fotowoltaiczne na połaci dachu (niedostępne dla dachu płaskiego bez powierzchni skośnej).',
  GATE: 'Brama wjazdowa/wejściowa jako dodatkowy element na modelu.',
};
