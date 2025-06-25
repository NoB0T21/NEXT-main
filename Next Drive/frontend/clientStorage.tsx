'use client'

import { useEffect, useState } from 'react';

export default function ClientLocalStorage() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    setValue(stored);
  }, []);

  return <div>Your token is: {value}</div>;
}
