import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { Exercise, addExercise, ExerciseItem } from 'modules/routine';
import Button from 'components/common/Button';
import useAddExercise from 'hooks/useAddExercise';
import ErrorMessage from 'lib/ErrorMessage';
import { getKorCategory } from 'lib/methods';
import exerciseJSON from '../../data/exercise.json';

const AddExerciseWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  place-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;

const AddExerciseBlock = styled.div<{ visible: boolean; offset: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  top: ${({ visible }) => (visible ? '5%' : '100%')};
  left: 5%;
  position: fixed;
  max-width: 480px;
  width: 90%;
  height: 90%;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.background_main};
  overflow: hidden;
  transition: top 0.5s;
  h2 {
    align-self: center;
  }
  @media (min-width: 540px) {
    left: ${({ offset }) => offset / 2 - 240}px;
  }
`;

const CategoryListBlock = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
`;

const CategoryItemBlock = styled(Button)<{ checked: number }>`
  padding: 0.25rem;
  border: 1px solid
    ${({ checked, theme }) => (checked ? theme.primary : theme.border_main)};
`;

const ExerciseListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
  overflow-y: scroll;
`;

const ExerciseItemBlock = styled.li<{ isSelected: number }>`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.primary : theme.background_main};
`;

const FooterBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const ConfirmBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  div {
    display: grid;
    place-items: center;
    input {
      font-size: 2rem;
      width: 5rem;
    }
  }
`;

const ButtonsBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  .submit {
    padding: 0.25rem 1rem;
    background: ${({ theme }) => theme.primary};
    font-size: 1.25rem;
  }
  .close {
    padding: 0.25rem 1rem;
    background: ${({ theme }) => theme.background_sub};
    font-size: 1.25rem;
  }
`;

type AddExerciseProps = {
  id: string | null;
  day: number | null;
  visible: boolean;
  offset: number;
  onCloseModal: () => void;
};

const AddExerciseModal = ({
  id,
  day,
  visible,
  offset,
  onCloseModal,
}: AddExerciseProps) => {
  const exercise: Exercise[] = exerciseJSON;
  const dispatch = useDispatch();
  const {
    addState,
    onSetCategory,
    onSelectExercise,
    onChangeInput,
    checkInputs,
  } = useAddExercise();
  const [message, setMessage] = useState('');

  const onAddExercise = () => {
    if (!id || day === null) return;
    const error = checkInputs();
    if (error) {
      setMessage(error);
      return;
    }
    const exercise: ExerciseItem = {
      exercise: addState.selected as Exercise,
      weight: addState.inputs.weight,
      numberOfTimes: addState.inputs.numberOfTimes,
      numberOfSets: addState.inputs.numberOfSets,
    };
    dispatch(addExercise({ id, day, exercise }));
    onClose();
  };

  const onClose = () => {
    setMessage('');
    onCloseModal();
  };

  return (
    <AddExerciseWrapper visible={visible}>
      <AddExerciseBlock visible={visible} offset={offset}>
        <h2>운동 목록</h2>
        <CategoryListBlock>
          <CategoryItemBlock
            checked={addState.category === 'all' ? 1 : 0}
            onClick={() => onSetCategory('all')}
          >
            전체
          </CategoryItemBlock>
          <CategoryItemBlock
            checked={addState.category === 'upper' ? 1 : 0}
            onClick={() => onSetCategory('upper')}
          >
            상체
          </CategoryItemBlock>
          <CategoryItemBlock
            checked={addState.category === 'lower' ? 1 : 0}
            onClick={() => onSetCategory('lower')}
          >
            하체
          </CategoryItemBlock>
          <CategoryItemBlock
            checked={addState.category === 'core' ? 1 : 0}
            onClick={() => onSetCategory('core')}
          >
            코어
          </CategoryItemBlock>
        </CategoryListBlock>
        <ExerciseListBlock>
          {exercise
            .filter((exer) =>
              addState.category === 'all'
                ? true
                : exer.category === addState.category,
            )
            .map(
              (exer) => (
                <ExerciseItemBlock
                  onClick={() => onSelectExercise(exer)}
                  isSelected={addState.selected === exer ? 1 : 0}
                >
                  <b>{exer.name}</b>
                  <span>
                    [{getKorCategory(exer.category)}] {exer.part}
                  </span>
                </ExerciseItemBlock>
              ),
              [addState.category, addState.selected],
            )}
        </ExerciseListBlock>
        <FooterBlock>
          <ConfirmBlock>
            <div className="weight">
              <b>중량</b>
              <input
                type="number"
                min={0}
                value={addState.inputs.weight}
                onChange={(e) => onChangeInput('CHANGE_WEIGHT', e)}
              />
              kg
            </div>
            <div className="numOfTimes">
              <b>횟수</b>
              <input
                type="number"
                min={0}
                value={addState.inputs.numberOfTimes}
                onChange={(e) => onChangeInput('CHANGE_NUM_OF_TIMES', e)}
              />
              회
            </div>
            <div className="numOfSets">
              <b>세트 수</b>
              <input
                type="number"
                min={0}
                max={20}
                value={addState.inputs.numberOfSets}
                onChange={(e) => onChangeInput('CHANGE_NUM_OF_SETS', e)}
              />
              세트
            </div>
          </ConfirmBlock>
          <ButtonsBlock>
            <Button className="submit" onClick={onAddExercise}>
              추가
            </Button>
            <Button className="close" onClick={onClose}>
              취소
            </Button>
          </ButtonsBlock>
          <ErrorMessage message={message} />
        </FooterBlock>
      </AddExerciseBlock>
    </AddExerciseWrapper>
  );
};

export default React.memo(AddExerciseModal);
