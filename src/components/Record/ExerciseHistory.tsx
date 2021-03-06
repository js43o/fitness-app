import React from 'react';
import styled from '@emotion/styled';
import { CompleteItem } from 'types';

const ExerciseHistoryBlock = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
`;

const ExerciseHistoryItem = styled.li`
  display: flex;
  flex-direction: column;
  place-items: center;
  flex-grow: 1;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  text-align: center;
`;

type ExerciseHistoryProps = {
  complete: CompleteItem | null;
};

const ExerciseHistory = ({ complete }: ExerciseHistoryProps) => {
  if (!complete || complete.list.length <= 0)
    return <ExerciseHistoryBlock>수행한 운동이 없습니다.</ExerciseHistoryBlock>;

  return (
    <ExerciseHistoryBlock>
      {complete.list.map((exer) => (
        <ExerciseHistoryItem>
          <b>{exer.exercise}</b>
          <small>
            {exer.weight}kg, {exer.numberOfTimes}x{exer.numberOfSets}
          </small>
        </ExerciseHistoryItem>
      ))}
    </ExerciseHistoryBlock>
  );
};

export default ExerciseHistory;
