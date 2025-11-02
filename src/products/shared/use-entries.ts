import { customAlphabet } from 'nanoid'
import { useCallback, useMemo, useState } from 'react'

const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16)

export function useEntries({ basePath }: { basePath: string }) {
  const localEntries = useMemo(() => {
    return localStorage.getItem(basePath) ? JSON.parse(localStorage.getItem(basePath) || '{}') : []
  }, [basePath])

  const [entries, setEntries] = useState<any>(localEntries)

  const addEntry = useCallback(() => {
    const newEntry = { id: generateId(), data: {}, createdAt: new Date().toISOString() }
    const newEntries = { ...entries, [newEntry.id]: newEntry }
    localStorage.setItem(basePath, JSON.stringify(newEntries))

    return newEntry
  }, [basePath, entries])

  const removeEntry = useCallback(
    (id: string) => {
      setEntries((prevEntries: any) => {
        const newEntries = { ...prevEntries }
        delete newEntries[id as keyof typeof newEntries]
        localStorage.setItem(basePath, JSON.stringify(newEntries))
        return newEntries
      })
    },
    [basePath, entries]
  )

  const updateEntryData = useCallback(
    (id: string, data: Record<string, unknown>) => {
      setEntries((prevEntries: any) => {
        const newEntries = { ...prevEntries }

        if (!newEntries[id]) return newEntries

        newEntries[id] = {
          ...newEntries[id],
          data: { ...newEntries[id].data, ...data },
        }

        localStorage.setItem(basePath, JSON.stringify(newEntries))

        return newEntries
      })
    },
    [basePath, entries]
  )

  return { entries, addEntry, removeEntry, updateEntryData }
}
