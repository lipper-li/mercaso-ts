import { useEffect, useState } from 'react';
export function useLogin() {
  const [count, setCount] = useState(0);
  useEffect(() => {}, [count]);

  return { count, setCount };
}
