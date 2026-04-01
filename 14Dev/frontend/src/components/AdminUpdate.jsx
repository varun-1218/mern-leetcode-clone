import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, useParams } from 'react-router';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminUpdate() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  // Fetch problem data on component mount
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        console.log('Fetching problem ID:', problemId);
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const data = response.data;
        
        console.log('Fetched problem data:', data);
        
        // Ensure all required arrays exist
        const formData = {
          title: data.title || '',
          description: data.description || '',
          difficulty: data.difficulty || 'easy',
          tags: data.tags || 'array',
          visibleTestCases: data.visibleTestCases || [{ input: '', output: '', explanation: '' }],
          hiddenTestCases: data.hiddenTestCases || [{ input: '', output: '' }],
          startCode: data.startCode || [
            { language: 'C++', initialCode: '' },
            { language: 'Java', initialCode: '' },
            { language: 'JavaScript', initialCode: '' }
          ],
          referenceSolution: data.referenceSolution || [
            { language: 'C++', completeCode: '' },
            { language: 'Java', completeCode: '' },
            { language: 'JavaScript', completeCode: '' }
          ]
        };
        
        console.log('Form data to reset:', formData);
        reset(formData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to fetch problem data: ' + (err.response?.data || err.message));
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    } else {
      setError('No problem ID provided');
      setLoading(false);
    }
  }, [problemId, reset]);

  const onSubmit = async (data) => {
    try {
      console.log('Submitting update for problem:', problemId);
      console.log('Update data:', data);
      
      await axiosClient.put(`/problem/update/${problemId}`, data);
      alert('Problem updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Update error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
        <button onClick={() => navigate('/admin/update')} className="btn btn-primary mt-4">
          Back to Problem List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Update Problem</h1>
        <button onClick={() => navigate('/admin/update')} className="btn btn-ghost">
          Back to List
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register('title')}
                className={`input input-bordered ${errors.title && 'input-error'}`}
              />
              {errors.title && (
                <span className="text-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
              />
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register('difficulty')}
                  className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Tag</span>
                </label>
                <select
                  {...register('tags')}
                  className={`select select-bordered ${errors.tags && 'select-error'}`}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          
          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Visible Case
              </button>
            </div>
            
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Test Case {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs btn-error"
                    disabled={visibleFields.length <= 1}
                  >
                    Remove
                  </button>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Input</span>
                  </label>
                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Output</span>
                  </label>
                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Explanation</span>
                  </label>
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    className="textarea textarea-bordered w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Hidden Case
              </button>
            </div>
            
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Hidden Test {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs btn-error"
                    disabled={hiddenFields.length <= 1}
                  >
                    Remove
                  </button>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Input</span>
                  </label>
                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    className="input input-bordered w-full"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Output</span>
                  </label>
                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          
          <div className="space-y-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                </h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Code</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reference Solution</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin/update')}
            className="btn btn-ghost flex-1"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            Update Problem
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminUpdate;