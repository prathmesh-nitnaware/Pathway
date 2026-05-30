import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

interface College {
  id: string
  name: string
  image: string
  fees: number
  rating: number
  location: string
  highestPackage: string
  avgPackage: string
  establishedYear: number
  courses?: any[]
}

interface CompareState {
  compareColleges: College[]
  addCollege: (college: College) => void
  removeCollege: (collegeId: string) => void
  clearCompare: () => void
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      compareColleges: [],
      addCollege: (college) => set((state) => {
        if (state.compareColleges.length >= 3) {
          toast.error('You can only compare up to 3 colleges at a time.')
          return state
        }
        if (state.compareColleges.find((c) => c.id === college.id)) {
          return state
        }
        toast.success(`${college.name} added to compare!`)
        return { compareColleges: [...state.compareColleges, college] }
      }),
      removeCollege: (collegeId) => set((state) => {
        const college = state.compareColleges.find(c => c.id === collegeId)
        if (college) toast.success(`${college.name} removed`)
        return {
          compareColleges: state.compareColleges.filter((c) => c.id !== collegeId)
        }
      }),
      clearCompare: () => set(() => {
        toast.success('Compare list cleared')
        return { compareColleges: [] }
      })
    }),
    {
      name: 'college-compare-storage',
    }
  )
)
