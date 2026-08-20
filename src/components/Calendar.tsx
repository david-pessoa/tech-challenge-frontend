import styled from 'styled-components';
import type { Role } from '../types/Roles';

type CalendarProp = {
  role: Role;
};

export default function Calendar({ role }: CalendarProp) {
  const today = new Date();
  const monthFirstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const totalOfDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const weekDay = monthFirstDay.getDay();

  const numOfWeeks = Math.ceil((weekDay + totalOfDays) / 7);

  let count = 0;

  const roleStyle = {
    ALUNO: {
      backgroundColor: '#FDE9A06B',
      color: '#B88337',
    },
    PROFESSOR: {
      backgroundColor: '#FBB3BEB5',
      color: '#E64B63',
    },
    ADMIN: {
      backgroundColor: '#D7EBE6',
      color: '#28645A',
    },
  };

  const CalendarList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
    margin-bottom: 2.688rem;
  `;

  const CalendarRow = styled.li`
    display: flex;
    justify-content: space-between;
  `;

  const WeekDays = styled.p`
    width: 48px;
    display: flex;
    justify-content: center;
  `;

  const CalendarDay = styled.p<{ $role: Role }>`
    height: 48px;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: ${({ $role }) => roleStyle[$role].backgroundColor};
    color: ${({ $role }) => roleStyle[$role].color};
    font-weight: 700;
  `;
  const CalendarEmptyDay = styled.p`
    height: 48px;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const CalendarWeekendDay = styled.p`
    height: 48px;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #32434D;
    opacity: 40%;
    font-weight: 700;
  `;

  const Today = styled.p`
    height: 48px;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #e44cd29b;
    color: #72316b;
    font-weight: 700;
  `;

  return (
      <CalendarList>
        <CalendarRow>
          <WeekDays>dom</WeekDays>
          <WeekDays>seg</WeekDays>
          <WeekDays>ter</WeekDays>
          <WeekDays>qua</WeekDays>
          <WeekDays>qui</WeekDays>
          <WeekDays>sex</WeekDays>
          <WeekDays>sab</WeekDays>
        </CalendarRow>
        {Array.from({ length: numOfWeeks }, (_, index) => (
          <CalendarRow key={index}>
            {Array.from({ length: 7 }, (_, dayOfWeek) =>
              (index === 0 && dayOfWeek < weekDay) ||
              (index === numOfWeeks - 1 && count + 1 > totalOfDays) ? (
                <CalendarEmptyDay key={dayOfWeek} />
              ) : today.getDate() == count + 1 ? (<Today>{++count}</Today>) : dayOfWeek === 0 || dayOfWeek === 6 ? (
                <CalendarWeekendDay key={dayOfWeek}>
                  {++count}
                </CalendarWeekendDay>
              ) : (
                <CalendarDay key={dayOfWeek} $role={role}>
                  {++count}
                </CalendarDay>
              )
            )}
          </CalendarRow>
        ))}
      </CalendarList>
  );
}
