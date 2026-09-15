'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';

interface StateHandlerProps {
  children: React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}

function StateHandlerInner({
  children,
  emptyTitle,
  emptyMessage,
  errorTitle,
  errorMessage,
}: StateHandlerProps) {
  const searchParams = useSearchParams();
  const stateParam = searchParams.get('state');
  const { t } = useAppState();

  if (stateParam === 'loading') {
    return (
      <div className="state-container loading-state" role="status">
        <div className="spinner" aria-hidden="true" />
        <p className="state-text">{t('states.loading') || 'Loading details...'}</p>
      </div>
    );
  }

  if (stateParam === 'empty') {
    return (
      <div className="state-container empty-state">
        <div className="state-icon">📭</div>
        <h3 className="state-title">{emptyTitle || t('states.empty') || 'No records found'}</h3>
        <p className="state-text">{emptyMessage || t('states.emptySubtitle') || 'There is nothing to display here right now.'}</p>
      </div>
    );
  }

  if (stateParam === 'error') {
    return (
      <div className="state-container error-state" role="alert">
        <div className="state-icon">⚠️</div>
        <h3 className="state-title">{errorTitle || t('states.error') || 'Unable to load data'}</h3>
        <p className="state-text">{errorMessage || t('states.errorSubtitle') || 'An error occurred. Please try refreshing the page.'}</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function StateHandler(props: StateHandlerProps) {
  return (
    <Suspense fallback={<>{props.children}</>}>
      <StateHandlerInner {...props} />
    </Suspense>
  );
}
