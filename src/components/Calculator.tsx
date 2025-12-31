import React, { useState, useMemo } from 'react';
import { Calculator as CalcIcon, Droplet, Syringe, AlertTriangle, RotateCcw, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface Preset {
    name: string;
    peptideAmount: number;
    waterVolume: number;
    typicalDose: number;
}

const Calculator: React.FC = () => {
    const [peptideAmount, setPeptideAmount] = useState<number>(10);
    const [waterVolume, setWaterVolume] = useState<number>(2);
    const [desiredDose, setDesiredDose] = useState<number>(2500);

    const presets: Preset[] = [
        { name: 'Tirzepatide 5mg', peptideAmount: 5, waterVolume: 1, typicalDose: 2500 },
        { name: 'Tirzepatide 10mg', peptideAmount: 10, waterVolume: 2, typicalDose: 2500 },
        { name: 'Tirzepatide 15mg', peptideAmount: 15, waterVolume: 2, typicalDose: 2500 },
        { name: 'Tirzepatide 30mg', peptideAmount: 30, waterVolume: 3, typicalDose: 2500 },
    ];

    const applyPreset = (preset: Preset) => {
        setPeptideAmount(preset.peptideAmount);
        setWaterVolume(preset.waterVolume);
        setDesiredDose(preset.typicalDose);
    };

    const resetCalculator = () => {
        setPeptideAmount(10);
        setWaterVolume(2);
        setDesiredDose(2500);
    };

    // Calculations
    const calculations = useMemo(() => {
        const peptideMcg = peptideAmount * 1000; // Convert mg to mcg
        const concentrationPerMl = peptideMcg / waterVolume; // mcg per ml
        const mlPerDose = desiredDose / concentrationPerMl; // ml needed
        const unitsPerDose = mlPerDose * 100; // Insulin syringe units (100 units = 1ml)
        const totalDoses = peptideMcg / desiredDose;

        return {
            concentrationPerMl: isFinite(concentrationPerMl) ? concentrationPerMl : 0,
            mlPerDose: isFinite(mlPerDose) ? mlPerDose : 0,
            unitsPerDose: isFinite(unitsPerDose) ? unitsPerDose : 0,
            totalDoses: isFinite(totalDoses) ? Math.floor(totalDoses) : 0,
        };
    }, [peptideAmount, waterVolume, desiredDose]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-theme-secondary to-theme-accent text-white py-16 px-4 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <CalcIcon className="w-16 h-16 mx-auto mb-4 opacity-90" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Peptide Calculator</h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            Calculate reconstitution volumes and dosing for your peptides.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                {/* Disclaimer */}
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">Disclaimer</p>
                        <p>This calculator is for reference only. Always consult with a healthcare professional for proper dosing guidance. Double-check all calculations before use.</p>
                    </div>
                </div>

                {/* Preset Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
                >
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Syringe className="w-5 h-5 text-theme-accent" />
                        Quick Presets
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="bg-gray-50 hover:bg-theme-accent/10 border border-gray-200 hover:border-theme-accent rounded-lg p-3 text-sm font-medium text-gray-700 hover:text-theme-accent transition-all"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Droplet className="w-5 h-5 text-theme-accent" />
                                Enter Values
                            </h2>
                            <button
                                onClick={resetCalculator}
                                className="text-gray-500 hover:text-theme-accent text-sm flex items-center gap-1 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Peptide Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={peptideAmount}
                                        onChange={(e) => setPeptideAmount(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.5"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent outline-none transition-all pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">mg</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Total peptide in your vial</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bacteriostatic Water Volume
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={waterVolume}
                                        onChange={(e) => setWaterVolume(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.1"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent outline-none transition-all pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">ml</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Amount of BAC water to add</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Desired Dose
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={desiredDose}
                                        onChange={(e) => setDesiredDose(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="100"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent outline-none transition-all pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">mcg</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">How much you want per injection (1mg = 1000mcg)</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Results Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CalcIcon className="w-5 h-5 text-theme-accent" />
                            Calculation Results
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-theme-accent/5 border border-theme-accent/20 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Concentration after reconstitution</p>
                                <p className="text-2xl font-bold text-theme-accent">
                                    {calculations.concentrationPerMl.toLocaleString('en-US', { maximumFractionDigits: 0 })} mcg/ml
                                </p>
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                <p className="text-sm text-green-700 mb-1">Volume per dose</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {calculations.mlPerDose.toFixed(3)} ml
                                </p>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                                <p className="text-sm text-purple-700 mb-1">Insulin syringe units (per dose)</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {calculations.unitsPerDose.toFixed(1)} units
                                </p>
                                <p className="text-xs text-purple-600 mt-1">On a 100-unit insulin syringe</p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Total doses per vial</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {calculations.totalDoses} doses
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    At {desiredDose.toLocaleString()} mcg ({(desiredDose / 1000).toFixed(1)} mg) per dose
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-6"
                >
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-2">How to Use This Calculator</p>
                            <ol className="list-decimal list-inside space-y-1 text-blue-700">
                                <li>Enter the total amount of peptide in your vial (in mg)</li>
                                <li>Enter how much bacteriostatic water you'll add (in ml)</li>
                                <li>Enter your desired dose per injection (in mcg)</li>
                                <li>Read the results to know how much to draw in your syringe</li>
                            </ol>
                            <p className="mt-3 text-blue-600">
                                <strong>Tip:</strong> For Tirzepatide, common starting doses are 2.5mg (2500mcg) once weekly.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Calculator;
