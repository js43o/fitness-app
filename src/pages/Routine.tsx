import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Template from 'templates/Template';
import { addRoutine } from 'modules/user';
import { userSelector } from 'modules/hooks';
import { hideScroll, unhideScroll } from 'lib/methods';
import RoutineItem from 'components/Routine/WeekRoutine';
import AddExercise from 'components/Routine/AddExerciseModal';
import Button from 'components/common/Button';
import { BsPlusCircle } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import useErrorMessage from 'hooks/useErrorMessage';

const AddRoutineButton = styled(Button)`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  width: 100%;
  place-items: center;
  padding: 0.5rem;
  margin-top: 1rem;
  font-size: 2rem;
  b {
    font-size: 1rem;
  }
`;

const RoutineListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0.5rem;
`;

const RoutinePage = () => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const windowWidth = useRef(document.body.offsetWidth);
  const [visible, setVisible] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const { onError, ErrorMessage } = useErrorMessage();

  const onOpenModal = useCallback((day: number) => {
    windowWidth.current = document.body.offsetWidth;
    setDay(day);
    setModal(true);
    hideScroll();
  }, []);
  const onCloseModal = useCallback(() => {
    setModal(false);
    unhideScroll();
  }, []);

  const onSetVisible = useCallback((routineId?: string) => {
    if (routineId) {
      setVisible(routineId);
      return;
    }
    setVisible(null);
  }, []);
  const onSetEditing = useCallback((routineId?: string) => {
    if (routineId) {
      setVisible(routineId);
      setEditing(routineId);
      return;
    }
    setEditing(null);
  }, []);

  const onAddRoutine = () => {
    if (user.routines.length >= 10) {
      onError('?????? ????????? ?????? ?????? ?????? 10????????????.');
      return;
    }
    const routineId = uuidv4();
    dispatch(addRoutine({ username: user.username, routineId }));
    onSetEditing(routineId);
  };

  return (
    <Template>
      <AddExercise
        routineId={editing}
        day={day}
        visible={modal}
        offset={windowWidth.current}
        onCloseModal={onCloseModal}
      />
      <h1>?????? ??????</h1>
      <RoutineListBlock>
        {user.routines.map((routine) => (
          <RoutineItem
            key={routine.routineId}
            routine={routine}
            isVisible={visible === routine.routineId}
            isEditing={editing === routine.routineId}
            onOpenModal={onOpenModal}
            onSetVisible={onSetVisible}
            onSetEditing={onSetEditing}
          />
        ))}
      </RoutineListBlock>
      <AddRoutineButton onClick={onAddRoutine}>
        <BsPlusCircle />
        <b>?????? ??????</b>
      </AddRoutineButton>
      <ErrorMessage />
    </Template>
  );
};

export default React.memo(RoutinePage);
