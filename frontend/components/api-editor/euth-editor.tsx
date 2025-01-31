import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"

import React from "react"

interface AuthHeader {
  type: 'None' | 'Bearer Token' | 'API Key' | 'Basic Auth'
  key: string
  value: string
}

export const AuthHeaderEditor: React.FC<{
  authHeader: AuthHeader
  updateAuthHeader: (updatedAuthHeader: AuthHeader) => void
}> = ({ authHeader, updateAuthHeader }) => {
  return (
    <div className="mb-4 p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Authentication</h3>
      <Select
        value={authHeader.type}
        onValueChange={(value: AuthHeader['type']) => updateAuthHeader({ ...authHeader, type: value })}
      >
        <SelectTrigger className="w-full mb-2">
          <SelectValue placeholder="Select auth type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="None">No Authentication</SelectItem>
          <SelectItem value="Bearer Token">Bearer Token</SelectItem>
          <SelectItem value="API Key">API Key</SelectItem>
          <SelectItem value="Basic Auth">Basic Auth</SelectItem>
        </SelectContent>
      </Select>
      {authHeader.type !== 'None' && (
        <>
          {authHeader.type === 'API Key' && (
            <Input
              value={authHeader.key}
              onChange={(e) => updateAuthHeader({ ...authHeader, key: e.target.value })}
              placeholder="Header Key (e.g., X-API-Key)"
              className="mb-2"
            />
          )}
          <Input
            value={authHeader.value}
            onChange={(e) => updateAuthHeader({ ...authHeader, value: e.target.value })}
            placeholder={authHeader.type === 'Basic Auth' ? 'username:password' : 'Token or API Key'}
            className="w-full"
          />
        </>
      )}
    </div>
  )
}