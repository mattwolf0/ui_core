function BaseIcon({ children, className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {children}
        </svg>
    )
}

export function MainIcon({ className }) {
    return (
        <BaseIcon className={className}>
            <path d="M12 2.5 14.96 8.5 21.5 9.45l-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.12 1.12-6.54L2.5 9.45l6.54-.95L12 2.5Z" />
        </BaseIcon>
    )
}

export function StaminaIcon({ className }) {
    return (
        <BaseIcon className={className}>
            <path d="M13.1 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Zm-1.5 6.1 2.6 1.25 1.55 3.05 2.95 1.65-.95 1.7-3.52-1.95-1.3-2.55-.65 3.15 2.25 2.5v3.55H12.6v-2.85L10 16.3l.9-4.25-2.55 2.15-2.75-.55.35-1.9 1.95.4 3.75-3.25Z" />
        </BaseIcon>
    )
}

export function ShootingIcon({ className }) {
    return (
        <BaseIcon className={className}>
            <path d="M3 9.5h11.45l3.3-2.45H21v3l-1.85 1.2v2.85l-2.3 1.55h-2.2v2.1h-2.2v-2.1H9.5l-2.6 1.9H4.1v-1.9l1.95-1.5H3v-2.1h4.35V11.6H3V9.5Z" />
        </BaseIcon>
    )
}

export function CraftingIcon({ className }) {
    return (
        <BaseIcon className={className}>
            <path d="M14.5 3.5a4.5 4.5 0 0 0 2.32 5.91l-7.7 7.7a2.25 2.25 0 1 0 3.18 3.18l7.7-7.7a4.5 4.5 0 0 0 1.58-7.49l-3.01 3.01-2.12-2.12 3.01-3.01A4.47 4.47 0 0 0 14.5 3.5Z" />
        </BaseIcon>
    )
}

export function SearchIcon({ className }) {
    return (
        <BaseIcon className={className}>
            <path d="M10.5 3a7.5 7.5 0 1 0 4.73 13.32l4.22 4.23 1.41-1.42-4.23-4.22A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z" />
        </BaseIcon>
    )
}

export function SkillIcon({ skillId, className }) {
    if (skillId === 'stamina') {
        return <StaminaIcon className={className} />
    }

    if (skillId === 'shooting') {
        return <ShootingIcon className={className} />
    }

    if (skillId === 'crafting') {
        return <CraftingIcon className={className} />
    }

    return <MainIcon className={className} />
}
