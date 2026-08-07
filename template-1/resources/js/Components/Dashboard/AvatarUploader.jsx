import React from 'react';
import Input from './Input';

export default function AvatarUploader({ name = '?', preview, onChange, error }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-slate-600 font-bold text-xl">
                {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span>{name?.charAt(0)?.toUpperCase() || '?'}</span>
                )}
            </div>
            <div className="flex-1">
                <Input
                    label="Foto Profil"
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    errors={error}
                />
            </div>
        </div>
    );
}
