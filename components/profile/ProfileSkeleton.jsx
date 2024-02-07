
export default function Component() {
    return (
        <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full animate-pulse bg-muted bg-slate-400"></div>
                <div className="flex-1 min-w-0 space-y-3">
                    <div className='flex justify-between items-center'>
                        <div className="mt-1 w-40 h-4 bg-slate-400"></div>
                    </div>
                    <div>
                        <div className="mt-1 w-72 h-4 bg-slate-400"></div>
                        <div className="mt-1 w-72 h-4 bg-slate-400"></div>
                        <div className="mt-1 w-72 h-4 bg-slate-400"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}