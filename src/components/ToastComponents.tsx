import styled from 'styled-components';

export const Toast = styled.div<{ $isSucess: boolean }>`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  width: min(22rem, calc(100% - 2rem));
  border-left: 0.35rem solid
    ${({ theme, $isSucess }) => ($isSucess ? '#6fb9a9' : `${theme.colors.primary}`)};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.fieldBackground};
  box-shadow: 0 0.5rem 1.5rem rgba(50, 67, 77, 0.16);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.field.fontSize};
  font-weight: ${({ theme }) => theme.typography.field.fontWeight};
  line-height: ${({ theme }) => theme.typography.field.lineHeight};
  padding: 1rem 1.25rem;

  @media (max-width: 720px) {
    top: 1rem;
    right: 1rem;
  }
`;

export const ToastCloseButton = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: inline-flex;
  padding: 0;

  span {
    font-size: 1.25rem;
    line-height: 1;
  }
`;

export type ToastStatus = 'success' | 'error';