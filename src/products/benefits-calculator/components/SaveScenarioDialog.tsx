import { useState } from 'react'
import { Button } from '~/components/Button'

interface SaveScenarioDialogProps {
  onSave: (name: string, description?: string, tags?: string[]) => void
  onCancel: () => void
  suggestedName: string
}

export function SaveScenarioDialog({
  onSave,
  onCancel,
  suggestedName,
}: SaveScenarioDialogProps) {
  const [name, setName] = useState(suggestedName)
  const [description, setDescription] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a scenario name')
      return
    }

    onSave(name.trim(), description.trim() || undefined, tags.length > 0 ? tags : undefined)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Save Scenario</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Single parent with 2 children"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes about this scenario..."
            rows={3}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Tags Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
            <Button
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-700 hover:text-blue-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-green-700 text-white hover:bg-green-800"
          >
            Save Scenario
          </Button>
        </div>
      </div>
    </div>
  )
}
